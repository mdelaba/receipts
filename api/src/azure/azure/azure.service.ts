import { BlobServiceClient, BlockBlobClient, ContainerSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { v4 } from 'uuid';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AzureService {

    constructor(private readonly configService: ConfigService) { }

    private async getBlobServiceInstance() {
        const connectionString = this.configService.get('CONNECTION_STRING');
        const blobClientService = await BlobServiceClient.fromConnectionString(connectionString,);
        return blobClientService;
    }

    public generateAuthorizationHeader(accountName: string, accountKey: string, containerName: string, blobName: string) {
        const date = new Date().toUTCString();
        const stringToSign = `GET\n\n\n\n\n\n\n\n\n\n\n\nx-ms-date:${date}\nx-ms-version:2020-04-08\n/${accountName}/${containerName}/${blobName}`;

        const hash = CryptoJS.HmacSHA256(stringToSign, CryptoJS.enc.Base64.parse(accountKey));
        const signature = hash.toString(CryptoJS.enc.Base64);

        const authorizationHeader = `SharedKey ${accountName}:${signature}`;

        const headers = {
            'x-ms-date': date,
            'x-ms-version': '2020-04-08',
            'Authorization': authorizationHeader
        };
        return headers;
    }

    public async generateSASToken(blobName: string, containerName: string): Promise<string> {

        const connectionString = this.configService.get('CONNECTION_STRING');

        const sasOptions = {
            containerName: containerName,
            blobName: blobName,
            permissions: ContainerSASPermissions.parse('r'), // Read, Write, Delete permissions
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + 600 * 1000), // 10 minutes expiry
        };

        const accountName = connectionString.match(/AccountName=([^;]+);/)[1];
        const accountKey = connectionString.match(/AccountKey=([^;]+);/)[1];

        if (!accountName || !accountKey) {
            throw new Error('Invalid connection string');
        }

        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

        // const headers = this.generateAuthorizationHeader(accountName, accountKey, containerName, blobName);

        return sasToken;
    }

    private async getBlobClient(fileName: string, containerName: string): Promise<BlockBlobClient> {
        const blobService = await this.getBlobServiceInstance();
        const containerClient = blobService.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        return blockBlobClient;
    }

    public async uploadFile(file: string, containerName: string) {
        const extension = file.split('.').pop();
        const file_name = v4() + '.' + extension; //= v4(); alone to upload file without a file extension
        const blockBlobClient = await this.getBlobClient(file_name, containerName);
        const fileUrl = blockBlobClient.url;

        const options = {
            blobHTTPHeaders: {
                blobContentType: 'application/pdf'
            }
        };

        await blockBlobClient.uploadFile(file, options);

        return fileUrl;
    }

    public async uploadData(file: Express.Multer.File, containerName: string) {

        const fileName = file.originalname;
        const extension = fileName.split('.').pop();
        const newBlobName = v4() + '.' + extension;

        const blobServiceClient = await this.getBlobServiceInstance();
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlockBlobClient(newBlobName);

        try {
            await blobClient.uploadData(file.buffer, {
                blobHTTPHeaders: { blobContentType: file.mimetype }
            });
            return blobClient.url;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file');
        }
    }

    public async downloadFile(fileUrl: string, containerName: string, destination: string) {
        const blobClient = this.getBlobClient(fileUrl, containerName);
        const downloadBlockBlobResponse = (await blobClient).download(0);
        const chunks: Buffer[] = [];
        const readableStream = (await downloadBlockBlobResponse).readableStreamBody as Readable;

        for await (const chunk of readableStream) {
            chunks.push(chunk);
        }

        return Buffer.concat(chunks);
    }
}
