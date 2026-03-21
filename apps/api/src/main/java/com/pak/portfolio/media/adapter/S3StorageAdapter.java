package com.pak.portfolio.media.adapter;

import com.pak.portfolio.common.config.PortfolioProperties;
import com.pak.portfolio.media.port.StoragePort;
import java.io.InputStream;
import java.net.URI;
import java.util.UUID;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Component
public class S3StorageAdapter implements StoragePort {

    private final PortfolioProperties properties;
    private final S3Client s3Client;

    public S3StorageAdapter(PortfolioProperties properties) {
        this.properties = properties;
        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(properties.getStorage().getEndpoint()))
                .region(Region.of(properties.getStorage().getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(properties.getStorage().getAccessKey(), properties.getStorage().getSecretKey())))
                .forcePathStyle(true)
                .build();
    }

    @Override
    public StoredAsset store(String filename, String contentType, long size, InputStream inputStream) {
        String safeName = filename == null ? "upload.bin" : filename.replaceAll("[^a-zA-Z0-9._-]", "-");
        String key = "%s-%s".formatted(UUID.randomUUID(), safeName);
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(properties.getStorage().getBucket())
                        .key(key)
                        .contentType(contentType)
                        .build(),
                RequestBody.fromInputStream(inputStream, size));
        return new StoredAsset(key, properties.getStorage().getPublicUrl() + "/" + key);
    }
}
