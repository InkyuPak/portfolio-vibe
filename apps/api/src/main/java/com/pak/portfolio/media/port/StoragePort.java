package com.pak.portfolio.media.port;

import java.io.InputStream;

public interface StoragePort {

    StoredAsset store(String filename, String contentType, long size, InputStream inputStream);

    record StoredAsset(String storageKey, String publicUrl) {
    }
}
