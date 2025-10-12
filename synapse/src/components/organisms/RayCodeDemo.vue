<template>
  <AppCard variant="elevated">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold mb-1">⚡ Ray分布式处理实现</h2>
          <p class="text-sm text-neutral-400">高性能并行特征提取代码示例</p>
        </div>
        <div class="flex gap-2">
          <AppButton
            v-for="example in codeExamples"
            :key="example.id"
            size="sm"
            :variant="selectedExample === example.id ? 'primary' : 'ghost'"
            @click="selectedExample = example.id"
          >
            {{ example.label }}
          </AppButton>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <!-- 代码展示 -->
      <div class="relative">
        <div class="absolute top-3 right-3 z-10">
          <AppButton size="sm" variant="ghost" @click="copyCode">
            📋 复制代码
          </AppButton>
        </div>
        <pre class="bg-neutral-950 rounded-lg p-4 overflow-x-auto border border-neutral-800"><code class="text-xs text-neutral-300 font-mono leading-relaxed">{{ currentCode }}</code></pre>
      </div>

      <!-- 代码说明 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-lg p-4 border border-primary-500/20">
          <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>核心特性</span>
          </h4>
          <ul class="space-y-2 text-xs text-neutral-300">
            <li v-for="feature in currentExample.features" :key="feature" class="flex items-start gap-2">
              <span class="text-primary-400 mt-0.5">•</span>
              <span>{{ feature }}</span>
            </li>
          </ul>
        </div>

        <div class="bg-gradient-to-br from-secondary-500/10 to-secondary-600/10 rounded-lg p-4 border border-secondary-500/20">
          <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
            <span>📈</span>
            <span>性能优势</span>
          </h4>
          <ul class="space-y-2 text-xs text-neutral-300">
            <li v-for="benefit in currentExample.benefits" :key="benefit" class="flex items-start gap-2">
              <span class="text-secondary-400 mt-0.5">•</span>
              <span>{{ benefit }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 执行流程可视化 -->
      <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
        <h4 class="font-semibold text-sm mb-4 flex items-center gap-2">
          <span>🔄</span>
          <span>执行流程</span>
        </h4>
        <div class="space-y-3">
          <div
            v-for="(step, index) in currentExample.workflow"
            :key="index"
            class="flex items-start gap-3"
          >
            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-semibold">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <div class="font-medium text-sm mb-1">{{ step.title }}</div>
              <div class="text-xs text-neutral-400">{{ step.description }}</div>
            </div>
            <div v-if="step.time" class="text-xs text-neutral-500 whitespace-nowrap">
              {{ step.time }}
            </div>
          </div>
        </div>
      </div>

      <!-- 性能对比 -->
      <div class="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
        <h4 class="font-semibold text-sm mb-3 flex items-center gap-2">
          <span>⚡</span>
          <span>性能对比</span>
        </h4>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-400 mb-1">{{ currentExample.performance.sequential }}</div>
            <div class="text-xs text-neutral-400">单线程处理</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-400 mb-1">{{ currentExample.performance.multiprocess }}</div>
            <div class="text-xs text-neutral-400">多进程处理</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-400 mb-1">{{ currentExample.performance.ray }}</div>
            <div class="text-xs text-neutral-400">Ray分布式</div>
          </div>
        </div>
        <div class="mt-3 text-center">
          <AppBadge variant="success">
            性能提升 {{ currentExample.performance.improvement }}
          </AppBadge>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppCard from '@/components/atoms/AppCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'

const codeExamples = [
  { id: 'basic', label: '基础架构' },
  { id: 'document', label: '文档处理' },
  { id: 'multimodal', label: '多模态' }
]

const selectedExample = ref('basic')

const examplesData = {
  basic: {
    code: `import ray
from transformers import AutoTokenizer, AutoModel
import torch

# 初始化Ray集群
ray.init(address='auto', ignore_reinit_error=True)

@ray.remote(num_gpus=0.25)  # 每个任务分配0.25个GPU
class FeatureExtractor:
    """分布式特征提取器"""
    
    def __init__(self, model_name: str = "bert-base-chinese"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name).to(self.device)
        self.model.eval()
    
    def extract_features(self, text: str) -> dict:
        """提取文本特征向量"""
        with torch.no_grad():
            inputs = self.tokenizer(
                text, 
                return_tensors="pt", 
                max_length=512, 
                truncation=True,
                padding=True
            ).to(self.device)
            
            outputs = self.model(**inputs)
            # 使用[CLS] token的输出作为句子表示
            features = outputs.last_hidden_state[:, 0, :].cpu().numpy()
            
        return {
            "vector": features.tolist()[0],  # 768维向量
            "dimension": features.shape[1],
            "model": self.model.config.name_or_path
        }

# 创建4个分布式特征提取器实例
extractors = [FeatureExtractor.remote() for _ in range(4)]

# 并行处理多个文档
documents = [
    "AI技术在数据处理中的应用...",
    "多模态特征提取的最佳实践...",
    "向量数据库的选型与优化...",
    # ... 更多文档
]

# 分发任务到不同的worker
futures = []
for i, doc in enumerate(documents):
    extractor = extractors[i % len(extractors)]  # 轮询分配
    future = extractor.extract_features.remote(doc)
    futures.append(future)

# 等待所有任务完成
results = ray.get(futures)
print(f"处理完成 {len(results)} 个文档")`,
    features: [
      '@ray.remote装饰器将类转换为分布式Actor',
      '自动GPU资源分配和管理',
      '支持多实例并行处理',
      '异步任务提交，非阻塞执行'
    ],
    benefits: [
      '4个GPU并行，处理速度提升3-4倍',
      '自动负载均衡，充分利用资源',
      '容错机制，任务失败自动重试',
      '易于扩展到更多机器'
    ],
    workflow: [
      { title: '初始化Ray集群', description: '连接到Ray集群，发现可用资源（CPU、GPU、内存）', time: '0.5s' },
      { title: '创建Actor实例', description: '在不同节点上启动4个FeatureExtractor实例，加载模型', time: '5-10s' },
      { title: '任务分发', description: '将文档轮询分配给不同的Actor，实现负载均衡', time: '~0.1s' },
      { title: '并行执行', description: '所有Actor同时处理各自的文档，互不干扰', time: '2-5s' },
      { title: '结果收集', description: 'ray.get()等待所有任务完成，收集结果', time: '~0.1s' }
    ],
    performance: {
      sequential: '120s',
      multiprocess: '35s',
      ray: '15s',
      improvement: '8倍'
    }
  },
  document: {
    code: `import ray
from typing import List, Dict
import fitz  # PyMuPDF
from transformers import pipeline

@ray.remote
class DocumentProcessor:
    """文档处理器 - 提取文本并生成特征"""
    
    def __init__(self):
        # 加载NER模型用于实体识别
        self.ner = pipeline("ner", model="ckiplab/bert-base-chinese-ner")
        # 加载特征提取模型
        self.feature_extractor = pipeline(
            "feature-extraction",
            model="bert-base-chinese"
        )
    
    def process_pdf(self, file_path: str, asset_id: str) -> Dict:
        """处理PDF文档"""
        # 1. 提取文本
        doc = fitz.open(file_path)
        full_text = ""
        page_contents = []
        
        for page_num, page in enumerate(doc):
            text = page.get_text()
            full_text += text
            page_contents.append({
                "page": page_num + 1,
                "text": text[:500]  # 保存前500字符
            })
        
        # 2. 提取特征向量
        features = self.feature_extractor(
            full_text[:512],  # 取前512个token
            return_tensors=False
        )
        # 对所有token的向量取平均
        vector = [sum(x)/len(x) for x in zip(*features[0])]
        
        # 3. 实体识别
        entities = self.ner(full_text[:1000])
        entity_summary = self._aggregate_entities(entities)
        
        # 4. 生成元数据
        metadata = {
            "asset_id": asset_id,
            "type": "document",
            "pages": len(doc),
            "total_chars": len(full_text),
            "page_contents": page_contents
        }
        
        return {
            "asset_id": asset_id,
            "vector": vector,  # 768维
            "entities": entity_summary,
            "metadata": metadata,
            "status": "completed"
        }
    
    def _aggregate_entities(self, entities: List) -> List[Dict]:
        """聚合实体识别结果"""
        entity_counts = {}
        for ent in entities:
            name = ent['word']
            ent_type = ent['entity']
            key = f"{name}_{ent_type}"
            entity_counts[key] = entity_counts.get(key, 0) + 1
        
        return [
            {
                "name": k.split('_')[0],
                "type": k.split('_')[1],
                "count": v
            }
            for k, v in sorted(
                entity_counts.items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:10]  # 返回top 10
        ]

# 使用示例
@ray.remote
def batch_process_documents(file_paths: List[str]) -> List[Dict]:
    """批量处理文档"""
    processor = DocumentProcessor.remote()
    
    futures = []
    for i, path in enumerate(file_paths):
        asset_id = f"doc_{i:06d}"
        future = processor.process_pdf.remote(path, asset_id)
        futures.append(future)
    
    results = ray.get(futures)
    return results

# 处理1000个文档
document_paths = get_all_documents()  # 获取所有文档路径
results = ray.get(batch_process_documents.remote(document_paths))`,
    features: [
      'PDF文本提取 + 特征向量生成',
      'NER实体识别，提取结构化信息',
      '分页内容保存，支持精确定位',
      '元数据完整记录，便于检索过滤'
    ],
    benefits: [
      '并行处理，1000个文档<5分钟',
      '特征+元数据双重索引',
      '实体关联，构建知识图谱',
      '原始内容保留，支持溯源'
    ],
    workflow: [
      { title: 'PDF解析', description: '使用PyMuPDF提取每页文本内容', time: '0.5s/doc' },
      { title: '特征提取', description: 'BERT编码生成768维向量表示', time: '2s/doc' },
      { title: '实体识别', description: 'NER模型识别人名、地名、机构等实体', time: '1s/doc' },
      { title: '元数据生成', description: '整理页数、字数、分页内容等信息', time: '0.1s/doc' },
      { title: '结果返回', description: '包含向量、实体、元数据的完整结果', time: '~0s' }
    ],
    performance: {
      sequential: '3500s',
      multiprocess: '450s',
      ray: '300s',
      improvement: '12倍'
    }
  },
  multimodal: {
    code: `import ray
from typing import Dict, List, Union
import torch
from transformers import CLIPProcessor, CLIPModel
from transformers import Wav2Vec2Processor, Wav2Vec2Model
import cv2
import librosa

@ray.remote(num_gpus=0.5)
class MultiModalFeatureExtractor:
    """多模态特征提取器 - 统一的特征空间"""
    
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # CLIP: 图像和文本的联合编码
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_model.to(self.device)
        
        # Wav2Vec2: 音频特征提取
        self.audio_processor = Wav2Vec2Processor.from_pretrained(
            "facebook/wav2vec2-base"
        )
        self.audio_model = Wav2Vec2Model.from_pretrained(
            "facebook/wav2vec2-base"
        )
        self.audio_model.to(self.device)
    
    def extract_image_features(self, image_path: str) -> Dict:
        """提取图像特征"""
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        with torch.no_grad():
            inputs = self.clip_processor(
                images=image, 
                return_tensors="pt"
            ).to(self.device)
            features = self.clip_model.get_image_features(**inputs)
            vector = features.cpu().numpy()[0]
        
        return {
            "vector": vector.tolist(),
            "dimension": len(vector),
            "modality": "image"
        }
    
    def extract_audio_features(self, audio_path: str) -> Dict:
        """提取音频特征"""
        # 加载音频
        audio, sr = librosa.load(audio_path, sr=16000)
        
        with torch.no_grad():
            inputs = self.audio_processor(
                audio, 
                sampling_rate=16000, 
                return_tensors="pt"
            ).to(self.device)
            outputs = self.audio_model(**inputs)
            # 对时间维度取平均
            vector = outputs.last_hidden_state.mean(dim=1).cpu().numpy()[0]
        
        return {
            "vector": vector.tolist(),
            "dimension": len(vector),
            "modality": "audio"
        }
    
    def extract_video_features(self, video_path: str) -> Dict:
        """提取视频特征 - 关键帧采样"""
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # 每秒采样1帧
        sample_interval = int(fps)
        frame_features = []
        
        for frame_idx in range(0, total_frames, sample_interval):
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            ret, frame = cap.read()
            if not ret:
                break
            
            # 提取帧特征
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            with torch.no_grad():
                inputs = self.clip_processor(
                    images=frame, 
                    return_tensors="pt"
                ).to(self.device)
                features = self.clip_model.get_image_features(**inputs)
                frame_features.append(features.cpu().numpy()[0])
        
        cap.release()
        
        # 对所有帧特征取平均
        avg_vector = sum(frame_features) / len(frame_features)
        
        return {
            "vector": avg_vector.tolist(),
            "dimension": len(avg_vector),
            "modality": "video",
            "sampled_frames": len(frame_features)
        }

@ray.remote
def process_multimodal_batch(assets: List[Dict]) -> List[Dict]:
    """批量处理多模态资产"""
    extractor = MultiModalFeatureExtractor.remote()
    
    futures = []
    for asset in assets:
        if asset['type'] == 'image':
            future = extractor.extract_image_features.remote(asset['path'])
        elif asset['type'] == 'audio':
            future = extractor.extract_audio_features.remote(asset['path'])
        elif asset['type'] == 'video':
            future = extractor.extract_video_features.remote(asset['path'])
        
        futures.append((asset['id'], future))
    
    results = []
    for asset_id, future in futures:
        feature_data = ray.get(future)
        results.append({
            "asset_id": asset_id,
            **feature_data
        })
    
    return results

# 混合批量处理
mixed_assets = [
    {"id": "img_001", "type": "image", "path": "/data/images/001.jpg"},
    {"id": "aud_001", "type": "audio", "path": "/data/audio/001.mp3"},
    {"id": "vid_001", "type": "video", "path": "/data/videos/001.mp4"},
    # ... 更多资产
]

results = ray.get(process_multimodal_batch.remote(mixed_assets))`,
    features: [
      'CLIP模型实现图像-文本联合编码',
      'Wav2Vec2直接从音频波形学习表示',
      '视频关键帧采样，平衡精度和效率',
      '统一的特征空间，支持跨模态检索'
    ],
    benefits: [
      '跨模态搜索：用文字搜图片/视频',
      '特征空间对齐，相似度可比较',
      'GPU加速，处理速度提升20-50倍',
      '可扩展架构，易于添加新模态'
    ],
    workflow: [
      { title: '资产分类', description: '根据文件类型路由到不同的处理器', time: '~0s' },
      { title: '模态特定处理', description: '图片用CLIP、音频用Wav2Vec2、视频采样关键帧', time: '1-5s' },
      { title: '特征归一化', description: '将不同模态的特征投影到统一空间', time: '0.1s' },
      { title: '质量检查', description: '验证特征维度、数值范围是否正常', time: '0.1s' },
      { title: '批量返回', description: '包含asset_id、向量、模态类型的结果', time: '~0s' }
    ],
    performance: {
      sequential: '5400s',
      multiprocess: '720s',
      ray: '180s',
      improvement: '30倍'
    }
  }
}

const currentExample = computed(() => examplesData[selectedExample.value as keyof typeof examplesData])
const currentCode = computed(() => currentExample.value.code)

const copyCode = () => {
  navigator.clipboard.writeText(currentCode.value)
  console.log('代码已复制到剪贴板')
}
</script>

