# 自习室应用设计文档

## 概述

一款Electron桌面应用，通过AI生成/预置的沉浸式场景背景 + 白噪音混合系统 + 专注计时器，帮助用户进入深度学习状态。

## 目标用户

需要沉浸式学习环境的学生和自学者。

## 核心功能

### 1. 场景系统

**功能描述：** 提供可切换的全屏背景场景，营造沉浸式学习氛围。

**预置场景（8-12个）：**
- 雨天书房、海边日落、森林木屋、咖啡厅、雪夜壁炉、星空露营、东京街头、禅意庭院等

**用户导入：**
- 支持拖拽或文件选择器导入本地图片
- 自动缩放适配窗口尺寸
- 支持格式：jpg/png/webp

**场景切换：**
- 底部缩略图栏（可隐藏）
- 点击切换，带淡入淡出过渡动画（300ms）
- 快捷键 `←` `→` 快速切换

**数据结构：**
```typescript
interface Scene {
  id: string;
  name: string;           // "雨天书房"
  image: string;          // 图片路径
  sounds: SoundRef[];     // 默认音效列表
  isBuiltin: boolean;     // 是否预置
}

interface SoundRef {
  soundId: string;
  volume: number;         // 0-1 默认音量
}
```

### 2. 白噪音系统

**功能描述：** 多音轨混合播放系统，支持独立音量控制。

**预置音效（15-20种）：**
- 自然类：雨声、雷声、海浪、风声、鸟鸣、溪流、森林、夏夜虫鸣
- 环境类：咖啡厅、篝火、键盘声、翻书声、火车
- 噪音类：白噪音、粉噪音、棕噪音
- 轻音乐：钢琴、Lo-fi、环境音乐

**混合功能：**
- 可同时开启多个音效（最多8轨）
- 每个音轨独立音量滑块
- 场景切换时，音效平滑过渡（淡入淡出）
- 所有音效无缝循环播放

**用户导入：**
- 支持拖入自定义音频文件
- 支持格式：mp3/wav/ogg
- 自动检测循环点或从头循环

**技术实现：** Howler.js，Web Audio API底层。

### 3. 计时器与学习统计

**番茄钟模式：**
- 默认25分钟专注 + 5分钟短休息
- 每4轮后15分钟长休息
- 自动切换专注/休息状态

**自定义计时器：**
- 用户设定时长（1-180分钟）
- 倒计时显示

**学习统计：**
- 今日专注时长
- 本周/本月专注时长汇总
- 完成番茄数统计
- 日历热力图（类似GitHub contribution图）

**提醒：**
- 时间到弹出系统通知（Electron Notification API）
- 可选音效提醒
- 休息期间场景可自动变暗/模糊

### 4. 主界面与交互

**默认状态：** 全屏沉浸模式，场景图铺满整个窗口。

**控制面板呼出：**
- 鼠标移到屏幕底部边缘 → 底部工具栏滑出
- 快捷键 `Tab` → 切换面板显示/隐藏
- 右键菜单 → 快速操作

**底部工具栏布局：**
- 左侧：计时器显示 + 开始/暂停/重置按钮
- 中间：当前活跃音效图标 + 主音量滑块 + 音效面板入口
- 右侧：场景切换入口 + 设置按钮

**音效详细面板：**
- 从底部工具栏点击展开
- 显示所有可用音效网格
- 每个音效：图标 + 名称 + 音量滑块 + 开关
- 支持搜索和分类筛选

**场景选择面板：**
- 从底部工具栏点击展开
- 网格展示所有场景缩略图
- 用户导入场景入口
- 可编辑/删除用户自定义场景

## 技术架构

### 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Electron 33+ |
| 前端 | React 18 + TypeScript |
| 样式 | TailwindCSS 4 |
| 状态管理 | Zustand |
| 音频引擎 | Howler.js |
| 配置存储 | electron-store |
| 统计存储 | better-sqlite3 |
| 构建 | Vite + electron-vite |

### 目录结构

```
study-room/
├── src/
│   ├── main/                    # Electron主进程
│   │   ├── index.ts             # 入口
│   │   ├── store.ts             # electron-store配置
│   │   └── database.ts          # SQLite初始化
│   ├── renderer/                # React渲染进程
│   │   ├── App.tsx              # 根组件
│   │   ├── components/
│   │   │   ├── Scene/           # 场景相关组件
│   │   │   │   ├── SceneView.tsx
│   │   │   │   ├── SceneSwitcher.tsx
│   │   │   │   └── SceneImport.tsx
│   │   │   ├── Audio/           # 音效相关组件
│   │   │   │   ├── AudioMixer.tsx
│   │   │   │   ├── SoundCard.tsx
│   │   │   │   └── VolumeSlider.tsx
│   │   │   ├── Timer/           # 计时器组件
│   │   │   │   ├── TimerDisplay.tsx
│   │   │   │   ├── PomodoroTimer.tsx
│   │   │   │   └── CustomTimer.tsx
│   │   │   ├── Stats/           # 统计组件
│   │   │   │   ├── StatsOverview.tsx
│   │   │   │   └── HeatmapCalendar.tsx
│   │   │   ├── Toolbar/         # 底部工具栏
│   │   │   │   ├── BottomToolbar.tsx
│   │   │   │   └── ToolbarItem.tsx
│   │   │   └── Settings/        # 设置
│   │   │       └── SettingsPanel.tsx
│   │   ├── stores/              # Zustand状态
│   │   │   ├── sceneStore.ts
│   │   │   ├── audioStore.ts
│   │   │   ├── timerStore.ts
│   │   │   └── statsStore.ts
│   │   ├── hooks/               # 自定义hooks
│   │   │   ├── useAudioEngine.ts
│   │   │   └── useKeyboard.ts
│   │   ├── utils/
│   │   │   └── audioEngine.ts   # Howler.js封装
│   │   └── styles/
│   │       └── globals.css
│   └── shared/                  # 主进程/渲染进程共享
│       └── types.ts
├── resources/                   # 静态资源
│   ├── scenes/                  # 预置场景图片
│   ├── sounds/                  # 预置音效文件
│   └── icons/                   # 应用图标
├── docs/
├── package.json
├── electron.vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### 数据流

```
用户操作 → React组件 → Zustand Store → 音频引擎/UI更新
                ↓
        IPC通信（仅配置/统计数据）
                ↓
        Electron主进程 → electron-store / SQLite
```

### 数据存储

**electron-store（配置）：**
```json
{
  "scenes": [...],
  "sounds": [...],
  "settings": {
    "pomodoroDuration": 25,
    "shortBreak": 5,
    "longBreak": 15,
    "autoStartBreak": false,
    "notificationSound": true
  }
}
```

**SQLite（统计）：**
```sql
CREATE TABLE focus_sessions (
  id INTEGER PRIMARY KEY,
  start_time DATETIME,
  end_time DATETIME,
  duration_minutes INTEGER,
  type TEXT,  -- 'pomodoro' | 'custom'
  completed BOOLEAN
);
```

## UI设计规范

**配色：** 深色系为主，控件使用半透明背景（`bg-black/40 backdrop-blur`），不遮挡场景。

**字体：** 系统默认无衬线字体，计时器使用等宽字体。

**动画：**
- 场景切换：淡入淡出 300ms
- 工具栏呼出：滑入 200ms ease-out
- 音量调节：实时响应，无延迟

**圆角：** 统一 12px 圆角。

## 非功能需求

- 应用启动时间 < 2秒
- 场景切换流畅，无卡顿
- 音频混合无爆音/断音
- 窗口可自由缩放，场景自适应
- 支持 Windows/macOS/Linux

## 不做的事（YAGNI）

- 不做在线账户/云同步
- 不做社交/分享功能
- 不做AI生成图片（纯预置+导入）
- 不做视频背景（仅静态图）
- 不做移动端