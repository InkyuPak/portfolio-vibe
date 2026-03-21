package com.pak.portfolio.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "portfolio")
public class PortfolioProperties {

    private final Admin admin = new Admin();
    private final Storage storage = new Storage();
    private final Webhook webhook = new Webhook();

    public Admin getAdmin() {
        return admin;
    }

    public Storage getStorage() {
        return storage;
    }

    public Webhook getWebhook() {
        return webhook;
    }

    public static class Admin {
        private String username = "admin";
        private String password = "change-me";

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class Storage {
        private String endpoint;
        private String region = "auto";
        private String accessKey;
        private String secretKey;
        private String bucket;
        private String publicUrl;

        public String getEndpoint() {
            return endpoint;
        }

        public void setEndpoint(String endpoint) {
            this.endpoint = endpoint;
        }

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
        }

        public String getAccessKey() {
            return accessKey;
        }

        public void setAccessKey(String accessKey) {
            this.accessKey = accessKey;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public void setSecretKey(String secretKey) {
            this.secretKey = secretKey;
        }

        public String getBucket() {
            return bucket;
        }

        public void setBucket(String bucket) {
            this.bucket = bucket;
        }

        public String getPublicUrl() {
            return publicUrl;
        }

        public void setPublicUrl(String publicUrl) {
            this.publicUrl = publicUrl;
        }
    }

    public static class Webhook {
        private String revalidateUrl;
        private String revalidateSecret;

        public String getRevalidateUrl() {
            return revalidateUrl;
        }

        public void setRevalidateUrl(String revalidateUrl) {
            this.revalidateUrl = revalidateUrl;
        }

        public String getRevalidateSecret() {
            return revalidateSecret;
        }

        public void setRevalidateSecret(String revalidateSecret) {
            this.revalidateSecret = revalidateSecret;
        }
    }
}
