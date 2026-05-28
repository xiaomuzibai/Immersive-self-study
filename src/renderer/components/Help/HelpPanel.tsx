import { memo } from 'react'

interface Props {
  visible: boolean
  onClose: () => void
}

const SECTIONS = [
  { title: '计时器', icon: '⏱️', items: [
    { label: '番茄钟模式', desc: '25分钟专注 + 5分钟休息，循环进行' },
    { label: '自定义模式', desc: '自由设定专注和休息时长' },
    { label: '秒表模式', desc: '正计时，记录专注时长' },
    { label: 'P / 空格', desc: '开始 / 暂停计时' },
  ]},
  { title: '音乐与声音', icon: '🎵', items: [
    { label: '轻音乐 (M)', desc: '多轨道背景音乐混音器' },
    { label: '环境音 (N)', desc: '雨声、火焰、风声、雷声、键盘、鸟鸣' },
    { label: '白噪音 (B)', desc: '白噪音 / 粉红噪音 / 棕色噪音' },
  ]},
  { title: '场景', icon: '🖼️', items: [
    { label: '场景切换 (S)', desc: '选择不同自习室背景' },
    { label: '数字键 1-9 / 0', desc: '快速切换到对应场景' },
    { label: '鼠标滚轮', desc: '上下滚动切换场景' },
  ]},
  { title: '学习工具', icon: '📚', items: [
    { label: '学习目标 (G)', desc: '设定每日/每周学习目标并追踪进度' },
    { label: '学习日历 (C)', desc: '日历热力图，直观展示学习频率' },
    { label: '专注评分 (F)', desc: '根据连续专注时长计算评分 (S/A/B/C/D)' },
    { label: '学习笔记 (L)', desc: '随时记录学习心得和待办事项' },
  ]},
  { title: '外观', icon: '🎨', items: [
    { label: '主题切换 (T)', desc: '暖阳/冰蓝/森林/深夜 四套主题' },
    { label: '氛围效果 (A)', desc: '萤火虫/散景光斑/漂浮雾气/斜射光线' },
  ]},
  { title: '系统', icon: '⚙️', items: [
    { label: '专注模式', desc: 'F11 进入沉浸模式，隐藏所有 UI' },
    { label: '设置', desc: '番茄钟时长、音量等参数配置' },
  ]},
]

const SHORTCUTS = [
  ['空格 / P', '开始 / 暂停计时'],
  ['1-9 / 0', '快速切换场景'],
  ['M', '轻音乐面板'],
  ['N', '环境音面板'],
  ['B', '白噪音面板'],
  ['S', '场景选择'],
  ['G', '学习目标'],
  ['C', '学习日历'],
  ['F', '专注评分'],
  ['L', '学习笔记'],
  ['T', '主题切换'],
  ['A', '氛围效果'],
  ['F11', '专注模式'],
  ['Esc', '关闭所有面板'],
  ['滚轮', '上下滚动切换场景'],
]

function HelpPanel({ visible, onClose }: Props) {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📖</span>
        <h3 className="text-2xl font-medium text-white tracking-wide">使用说明书</h3>
      </div>

      <div className="space-y-5">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-lg">{section.icon}</span>
              <h4 className="text-base font-medium text-amber-200/90 tracking-wide">{section.title}</h4>
            </div>
            <div className="space-y-2 pl-8">
              {section.items.map(item => (
                <div key={item.label} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span className="text-white/80 font-medium whitespace-nowrap min-w-[100px]">{item.label}</span>
                  <span className="text-white/50">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-lg">⌨️</span>
            <h4 className="text-base font-medium text-amber-200/90 tracking-wide">快捷键一览</h4>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 pl-8">
            {SHORTCUTS.map(([key, desc]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <kbd className="px-2 py-0.5 rounded bg-white/[0.08] border border-white/10 text-amber-200/80 font-mono text-xs whitespace-nowrap">
                  {key}
                </kbd>
                <span className="text-white/50">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(HelpPanel)
