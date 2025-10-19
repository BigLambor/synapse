# Synapse 数据入湖 API 文档

> **版本**: v1.0  
> **最后更新**: 2024-10-14  
> **目标**: 企业级多源数据接入集成

---

## 📋 概述

Synapse提供了完整的API，支持其他系统（CRM、监控工具、数据采集系统等）自动推送数据到数据湖，实现零人工干预的数据摄取流程。

### 核心优势

- ✅ **RESTful API**: 标准HTTP接口，任何语言都可集成
- ✅ **支持大文件**: 分片上传，支持GB级文件
- ✅ **断点续传**: 网络中断后自动恢复
- ✅ **批量操作**: 一次提交多个文件
- ✅ **异步处理**: 立即返回，后台AI处理
- ✅ **Webhook回调**: 处理完成后通知源系统

---

## 🔐 认证

所有API请求都需要在Header中包含API Key：

```http
Authorization: Bearer YOUR_API_KEY
```

### 获取API Key

1. 登录Synapse控制台
2. 进入 **设置 > API密钥**
3. 点击 "生成新密钥"
4. 复制并安全保存密钥

---

## 📡 API端点

### Base URL

```
https://api.synapse.company.com/v1
```

---

## 🚀 数据摄取API

### 1. 单文件上传

#### POST `/api/v1/assets/upload`

上传单个文件到Synapse数据湖。

**请求头**

```http
POST /api/v1/assets/upload
Authorization: Bearer YOUR_API_KEY
Content-Type: multipart/form-data
```

**请求体（FormData）**

| 字段 | 类型 | 必填 | 描述 |
|:-----|:-----|:-----|:-----|
| `file` | File | ✅ | 要上传的文件 |
| `category` | String | ❌ | 分类（如：用户反馈、竞品分析） |
| `tags` | String | ❌ | 标签，逗号分隔（如：视频,语音交互） |
| `metadata` | JSON | ❌ | 额外元数据 |
| `autoProcess` | Boolean | ❌ | 是否自动AI处理（默认：true） |
| `webhookUrl` | String | ❌ | 处理完成后回调URL |

**示例请求（cURL）**

```bash
curl -X POST https://api.synapse.company.com/v1/assets/upload \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "file=@/path/to/user-feedback.mp4" \
  -F "category=用户反馈" \
  -F "tags=视频,语音交互,智能座舱" \
  -F "autoProcess=true" \
  -F "webhookUrl=https://crm.company.com/webhooks/synapse"
```

**成功响应（200 OK）**

```json
{
  "success": true,
  "data": {
    "assetId": "asset_1697123456789",
    "uploadId": "upload_1697123456789",
    "status": "processing",
    "message": "文件上传成功，正在AI处理中",
    "estimatedProcessingTime": 120
  }
}
```

**错误响应（400 Bad Request）**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "不支持的文件类型",
    "supportedTypes": [".mp4", ".pdf", ".png", ".jpg", ".mp3"]
  }
}
```

---

### 2. URL导入

#### POST `/api/v1/assets/import-url`

从URL下载文件并导入到Synapse。

**请求体（JSON）**

```json
{
  "url": "https://example.com/user-feedback-video.mp4",
  "category": "用户反馈",
  "tags": ["视频", "语音交互"],
  "metadata": {
    "source": "CRM-Salesforce",
    "ticketId": "TICKET-12345"
  },
  "autoProcess": true,
  "webhookUrl": "https://crm.company.com/webhooks/synapse"
}
```

**示例请求**

```bash
curl -X POST https://api.synapse.company.com/v1/assets/import-url \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/video.mp4",
    "category": "用户反馈",
    "tags": ["视频"],
    "autoProcess": true
  }'
```

**响应**

```json
{
  "success": true,
  "data": {
    "importId": "import_1697123456789",
    "status": "downloading",
    "estimatedTime": 30
  }
}
```

---

### 3. 批量URL导入

#### POST `/api/v1/assets/batch-import`

批量从多个URL导入文件。

**请求体**

```json
{
  "urls": [
    {
      "url": "https://example.com/file1.mp4",
      "category": "用户反馈",
      "tags": ["视频"]
    },
    {
      "url": "https://example.com/file2.pdf",
      "category": "专利文档",
      "tags": ["文档", "NLP"]
    }
  ],
  "webhookUrl": "https://your-system.com/callback"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "batchId": "batch_1697123456789",
    "totalItems": 2,
    "status": "processing",
    "items": [
      {
        "url": "https://example.com/file1.mp4",
        "importId": "import_001",
        "status": "downloading"
      },
      {
        "url": "https://example.com/file2.pdf",
        "importId": "import_002",
        "status": "pending"
      }
    ]
  }
}
```

---

### 4. 大文件分片上传

#### 步骤1: 初始化上传

**POST `/api/v1/assets/upload/init`**

```json
{
  "fileName": "large-video.mp4",
  "fileSize": 1073741824,
  "chunkSize": 5242880,
  "category": "用户反馈",
  "tags": ["大文件", "视频"]
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "uploadId": "upload_1697123456789",
    "totalChunks": 205,
    "chunkSize": 5242880,
    "expiresAt": "2024-10-15T10:00:00Z"
  }
}
```

#### 步骤2: 上传分片

**POST `/api/v1/assets/upload/chunk`**

```http
POST /api/v1/assets/upload/chunk
Authorization: Bearer YOUR_API_KEY
Content-Type: multipart/form-data

uploadId: upload_1697123456789
chunkIndex: 0
chunk: <binary data>
```

**响应**

```json
{
  "success": true,
  "data": {
    "uploadId": "upload_1697123456789",
    "chunkIndex": 0,
    "status": "uploaded",
    "progress": {
      "uploaded": 1,
      "total": 205,
      "percentage": 0.49
    }
  }
}
```

#### 步骤3: 完成上传

**POST `/api/v1/assets/upload/complete`**

```json
{
  "uploadId": "upload_1697123456789",
  "autoProcess": true
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "assetId": "asset_1697123456789",
    "status": "processing",
    "message": "文件上传完成，开始AI处理"
  }
}
```

---

### 5. 对象存储直接注册

#### POST `/api/v1/assets/register-from-storage`

直接注册对象存储中已有的文件，无需上传。

**请求体**

```json
{
  "storageType": "s3",
  "bucket": "ai-training-data",
  "key": "user-feedbacks/2024/10/video-001.mp4",
  "region": "us-east-1",
  "category": "用户反馈",
  "tags": ["视频", "S3导入"],
  "autoProcess": true
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "assetId": "asset_1697123456789",
    "status": "registered",
    "message": "资产已注册，正在处理"
  }
}
```

---

## 📊 查询与监控API

### 6. 查询上传状态

#### GET `/api/v1/assets/{assetId}/status`

```bash
curl https://api.synapse.company.com/v1/assets/asset_123/status \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**响应**

```json
{
  "success": true,
  "data": {
    "assetId": "asset_123",
    "status": "completed",
    "processingStage": "completed",
    "progress": 100,
    "features": {
      "transcription": "已完成",
      "vectorization": "已完成",
      "tagging": "已完成"
    },
    "metadata": {
      "duration": 125,
      "fileSize": 45678912,
      "uploadedAt": "2024-10-14T08:30:00Z",
      "processedAt": "2024-10-14T08:32:15Z"
    }
  }
}
```

---

### 7. 批量查询状态

#### POST `/api/v1/assets/batch-status`

```json
{
  "assetIds": ["asset_001", "asset_002", "asset_003"]
}
```

---

## 🔔 Webhook回调

当资产处理完成后，Synapse会调用您提供的webhookUrl。

### 回调请求

**POST `{your_webhook_url}`**

```json
{
  "event": "asset.processing.completed",
  "timestamp": "2024-10-14T08:35:00Z",
  "data": {
    "assetId": "asset_1697123456789",
    "status": "completed",
    "processingDuration": 135,
    "features": {
      "transcription": "这是转录的文本内容...",
      "tags": ["语音唤醒失败", "智能座舱", "用户反馈"],
      "embedding": "已生成",
      "keyMoments": [
        {
          "timestamp": 15.5,
          "label": "问题描述",
          "sentiment": "negative"
        }
      ]
    },
    "metadata": {
      "originalFileName": "user-feedback.mp4",
      "category": "用户反馈",
      "tags": ["视频", "语音交互"]
    }
  }
}
```

### Webhook验证

为了安全，建议验证webhook签名：

```http
X-Synapse-Signature: sha256=abcdef123456...
```

验证代码（Node.js示例）：

```javascript
const crypto = require('crypto')

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = 'sha256=' + hmac.update(payload).digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
}
```

---

## 💻 SDK示例代码

### Python SDK

```python
import requests

class SynapseClient:
    def __init__(self, api_key, base_url='https://api.synapse.company.com/v1'):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}'
        }
    
    def upload_file(self, file_path, category=None, tags=None, webhook_url=None):
        """上传单个文件"""
        url = f'{self.base_url}/assets/upload'
        
        files = {'file': open(file_path, 'rb')}
        data = {
            'category': category,
            'tags': ','.join(tags) if tags else None,
            'autoProcess': True,
            'webhookUrl': webhook_url
        }
        
        response = requests.post(url, headers=self.headers, files=files, data=data)
        return response.json()
    
    def import_from_url(self, url, category=None, tags=None, metadata=None):
        """从URL导入"""
        endpoint = f'{self.base_url}/assets/import-url'
        
        payload = {
            'url': url,
            'category': category,
            'tags': tags,
            'metadata': metadata,
            'autoProcess': True
        }
        
        response = requests.post(endpoint, headers=self.headers, json=payload)
        return response.json()
    
    def get_asset_status(self, asset_id):
        """查询资产状态"""
        url = f'{self.base_url}/assets/{asset_id}/status'
        response = requests.get(url, headers=self.headers)
        return response.json()

# 使用示例
client = SynapseClient(api_key='YOUR_API_KEY')

# 上传文件
result = client.upload_file(
    file_path='/path/to/video.mp4',
    category='用户反馈',
    tags=['视频', '语音交互'],
    webhook_url='https://your-system.com/webhook'
)

print(f"Asset ID: {result['data']['assetId']}")
print(f"Status: {result['data']['status']}")
```

---

### Node.js SDK

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class SynapseClient {
  constructor(apiKey, baseUrl = 'https://api.synapse.company.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
  }

  async uploadFile(filePath, options = {}) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    
    if (options.category) form.append('category', options.category);
    if (options.tags) form.append('tags', options.tags.join(','));
    if (options.webhookUrl) form.append('webhookUrl', options.webhookUrl);
    form.append('autoProcess', 'true');

    const response = await this.axios.post('/assets/upload', form, {
      headers: form.getHeaders()
    });
    
    return response.data;
  }

  async importFromURL(url, options = {}) {
    const response = await this.axios.post('/assets/import-url', {
      url,
      category: options.category,
      tags: options.tags,
      metadata: options.metadata,
      autoProcess: true,
      webhookUrl: options.webhookUrl
    });
    
    return response.data;
  }

  async getAssetStatus(assetId) {
    const response = await this.axios.get(`/assets/${assetId}/status`);
    return response.data;
  }
}

// 使用示例
const client = new SynapseClient('YOUR_API_KEY');

// 上传文件
client.uploadFile('/path/to/video.mp4', {
  category: '用户反馈',
  tags: ['视频', '语音交互'],
  webhookUrl: 'https://your-system.com/webhook'
}).then(result => {
  console.log(`Asset ID: ${result.data.assetId}`);
  console.log(`Status: ${result.data.status}`);
});

// 从URL导入
client.importFromURL('https://example.com/document.pdf', {
  category: '专利文档',
  tags: ['PDF', '文档']
}).then(result => {
  console.log(`Import ID: ${result.data.importId}`);
});
```

---

### Java SDK

```java
import okhttp3.*;
import com.google.gson.*;
import java.io.File;
import java.io.IOException;

public class SynapseClient {
    private String apiKey;
    private String baseUrl;
    private OkHttpClient client;
    private Gson gson;

    public SynapseClient(String apiKey) {
        this(apiKey, "https://api.synapse.company.com/v1");
    }

    public SynapseClient(String apiKey, String baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.client = new OkHttpClient();
        this.gson = new Gson();
    }

    public JsonObject uploadFile(File file, UploadOptions options) throws IOException {
        RequestBody fileBody = RequestBody.create(file, MediaType.parse("application/octet-stream"));
        
        MultipartBody.Builder builder = new MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("file", file.getName(), fileBody)
            .addFormDataPart("autoProcess", "true");

        if (options.category != null) {
            builder.addFormDataPart("category", options.category);
        }
        if (options.tags != null && options.tags.length > 0) {
            builder.addFormDataPart("tags", String.join(",", options.tags));
        }

        RequestBody requestBody = builder.build();

        Request request = new Request.Builder()
            .url(baseUrl + "/assets/upload")
            .header("Authorization", "Bearer " + apiKey)
            .post(requestBody)
            .build();

        try (Response response = client.newCall(request).execute()) {
            return gson.fromJson(response.body().string(), JsonObject.class);
        }
    }

    public JsonObject importFromURL(String url, ImportOptions options) throws IOException {
        JsonObject payload = new JsonObject();
        payload.addProperty("url", url);
        payload.addProperty("autoProcess", true);
        
        if (options.category != null) {
            payload.addProperty("category", options.category);
        }

        RequestBody body = RequestBody.create(
            gson.toJson(payload),
            MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
            .url(baseUrl + "/assets/import-url")
            .header("Authorization", "Bearer " + apiKey)
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            return gson.fromJson(response.body().string(), JsonObject.class);
        }
    }

    // Options classes
    public static class UploadOptions {
        public String category;
        public String[] tags;
        public String webhookUrl;
    }

    public static class ImportOptions {
        public String category;
        public String[] tags;
        public JsonObject metadata;
    }
}

// 使用示例
public class Main {
    public static void main(String[] args) throws IOException {
        SynapseClient client = new SynapseClient("YOUR_API_KEY");

        // 上传文件
        File file = new File("/path/to/video.mp4");
        SynapseClient.UploadOptions options = new SynapseClient.UploadOptions();
        options.category = "用户反馈";
        options.tags = new String[]{"视频", "语音交互"};

        JsonObject result = client.uploadFile(file, options);
        System.out.println("Asset ID: " + result.getAsJsonObject("data").get("assetId"));
    }
}
```

---

## 🔧 常见集成场景

### 场景1: CRM系统集成

当客户提交带附件的工单时，自动推送到Synapse：

```javascript
// CRM系统的webhook handler
app.post('/tickets/created', async (req, res) => {
  const ticket = req.body;
  
  if (ticket.attachments && ticket.attachments.length > 0) {
    const synapse = new SynapseClient(process.env.SYNAPSE_API_KEY);
    
    for (const attachment of ticket.attachments) {
      await synapse.importFromURL(attachment.url, {
        category: '用户反馈',
        tags: ['CRM', ticket.severity, ticket.product],
        metadata: {
          source: 'CRM-Salesforce',
          ticketId: ticket.id,
          customerId: ticket.customerId,
          severity: ticket.severity
        },
        webhookUrl: 'https://crm.company.com/synapse-callback'
      });
    }
  }
  
  res.json({ success: true });
});
```

---

### 场景2: 竞品监控自动化

爬虫抓取竞品UI后自动上传：

```python
import scrapy
from synapse_client import SynapseClient

class CompetitorSpider(scrapy.Spider):
    name = 'competitor_ui'
    
    def __init__(self):
        self.synapse = SynapseClient(api_key=os.getenv('SYNAPSE_API_KEY'))
    
    def parse(self, response):
        # 下载UI截图
        screenshot_path = self.capture_screenshot(response.url)
        
        # 上传到Synapse
        result = self.synapse.upload_file(
            file_path=screenshot_path,
            category='竞品分析',
            tags=['UI设计', '竞品', response.meta['competitor_name']],
            metadata={
                'url': response.url,
                'competitor': response.meta['competitor_name'],
                'capturedAt': datetime.now().isoformat()
            }
        )
        
        self.log(f'Uploaded to Synapse: {result["data"]["assetId"]}')
```

---

### 场景3: IoT设备数据上传

车载设备定期上传日志和视频：

```python
import requests
import os

def upload_vehicle_data(device_id, data_dir):
    synapse = SynapseClient(api_key=os.getenv('SYNAPSE_API_KEY'))
    
    for filename in os.listdir(data_dir):
        file_path = os.path.join(data_dir, filename)
        
        result = synapse.upload_file(
            file_path=file_path,
            category='车载数据',
            tags=['IoT', f'device_{device_id}', '智能座舱'],
            metadata={
                'deviceId': device_id,
                'recordedAt': get_file_timestamp(filename)
            }
        )
        
        print(f'Uploaded {filename}: {result["data"]["assetId"]}')

# 定时任务
from apscheduler.schedulers.blocking import BlockingScheduler

scheduler = BlockingScheduler()
scheduler.add_job(
    upload_vehicle_data,
    'interval',
    hours=4,
    args=['DEVICE_001', '/data/vehicle-logs']
)
scheduler.start()
```

---

## ⚠️ 错误码

| 错误码 | HTTP状态 | 描述 | 解决方案 |
|:------|:---------|:-----|:---------|
| `INVALID_API_KEY` | 401 | API密钥无效 | 检查API密钥是否正确 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 | 减慢请求速度或联系升级配额 |
| `INVALID_FILE_TYPE` | 400 | 不支持的文件类型 | 查看支持的文件类型列表 |
| `FILE_TOO_LARGE` | 413 | 文件过大 | 使用分片上传或压缩文件 |
| `STORAGE_QUOTA_EXCEEDED` | 507 | 存储配额已满 | 清理旧数据或升级存储 |
| `PROCESSING_FAILED` | 500 | AI处理失败 | 查看错误详情或重试 |

---

## 📈 速率限制

| 计划 | 请求/分钟 | 上传/天 | 存储 |
|:-----|:----------|:--------|:-----|
| 免费版 | 60 | 100个文件 | 10GB |
| 专业版 | 600 | 1000个文件 | 1TB |
| 企业版 | 无限制 | 无限制 | 按需 |

---

## 🆘 技术支持

- 📧 Email: api-support@synapse.company.com
- 💬 Slack: #synapse-api
- 📖 文档: https://docs.synapse.company.com
- 🐛 问题反馈: https://github.com/company/synapse/issues

---

## 📝 更新日志

### v1.0 (2024-10-14)
- ✅ 初始版本发布
- ✅ 支持单文件上传
- ✅ 支持URL导入
- ✅ 支持大文件分片上传
- ✅ Webhook回调机制
- ✅ Python/Node.js/Java SDK

---

**文档版本**: 1.0  
**维护者**: Synapse API Team

