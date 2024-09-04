import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { Readable } from 'stream';
import { v4 } from 'uuid';

@Injectable()
export class AzureService {
    constructor(private readonly configService: ConfigService) { }
    private containerName: string;

    private async getBlobServiceInstance() {
        const connectionString = this.configService.get('CONNECTION_STRING');
        const blobClientService = await BlobServiceClient.fromConnectionString(connectionString,);
        return blobClientService;
    }

    private async getBlobClient(fileName: string): Promise<BlockBlobClient> {
        const blobService = await this.getBlobServiceInstance();
        const containerName = this.containerName;
        const containerClient = blobService.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        return blockBlobClient;
    }

    public async uploadFile(file: string, containerName: string) {
        this.containerName = containerName;
        const extension = file.split('.').pop();
        const file_name = v4() + '.' + extension;
        const blockBlobClient = await this.getBlobClient(file_name);
        const fileUrl = blockBlobClient.url;
        await blockBlobClient.uploadFile(file);

        return fileUrl;
    }

    public async downloadFile(fileUrl: string, containerName: string, destination: string) {
        this.containerName = containerName;
        const blobClient = this.getBlobClient(fileUrl);
        const downloadBlockBlobResponse = (await blobClient).download(0);
        const chunks: Buffer[] = [];
        const readableStream = (await downloadBlockBlobResponse).readableStreamBody as Readable;

        for await (const chunk of readableStream) {
            chunks.push(chunk);
        }

        return Buffer.concat(chunks);
    }
}
