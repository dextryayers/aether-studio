import React, { useState, useRef } from "react"
import { PageLayout } from "@/src/components/layout/PageLayout"
import { SEO } from "@/src/components/layout/SEO"
import { Eye, FileCode, Monitor, Sparkles, Upload, Download, Copy, Check, FileDown } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import Editor from "@monaco-editor/react"
import { Button } from "@/src/components/ui/button"
import { cn } from "@/src/lib/utils"

export default function MdPreview() {
  const [markdown, setMarkdown] = useState("# Aether Lab Protocol\n\n## Technical Specification\n- [x] **Item 01**: Structural Integrity\n- [ ] **Item 02**: High-Fidelity Rendering\n\n### Code Snippet\n```json\n{\n  \"status\": \"active\",\n  \"framework\": \"motion-react\"\n}\n```\n\n| Feature | Status | Priority |\n| :--- | :---: | ---: |\n| Markdown | OK | High |\n| GFM | Enabled | Medium |\n\n> This represents a private environment for digital re-engineering.")
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setMarkdown(content)
    }
    reader.readAsText(file)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'protocol.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageLayout>
      <SEO 
        title="Markdown Evolution | Lab" 
        description="High-fidelity GitHub Flavored Markdown (GFM) preview and editor for technical documentation."
        path="/lab/md-preview"
      />
      <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-8">
        {/* Header Protocol */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <Eye className="w-5 h-5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60 italic">Lab Sector 03</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
               MARKDOWN <br />
               <span className="italic opacity-20">PREVIEW</span>
             </h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
             <Button 
               variant="outline" 
               size="sm" 
               onClick={() => fileInputRef.current?.click()}
               className="h-12 px-6 rounded-none uppercase font-black tracking-widest text-[10px] gap-2 border-border"
             >
                <Upload className="w-3 h-3" /> Upload .md
             </Button>
             <input 
               type="file" 
               className="hidden" 
               ref={fileInputRef} 
               accept=".md" 
               onChange={handleFileUpload} 
             />
             
             <Button 
               variant="outline" 
               size="sm" 
               onClick={downloadMarkdown}
               className="h-12 px-6 rounded-none uppercase font-black tracking-widest text-[10px] gap-2 border-border"
             >
                <FileDown className="w-3 h-3" /> Download
             </Button>

             <div className="h-12 flex items-center px-6 gap-3 border border-border bg-emerald-500/5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">GFM Compliant</span>
             </div>
          </div>
        </div>

        {/* Workspace Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border border-border shadow-2xl">
          {/* Editor Terminal */}
          <div className="bg-[#1E1E1E] flex flex-col min-h-[600px] relative">
             <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 opacity-50 uppercase font-black text-[10px] tracking-widest text-white">
                   <FileCode className="w-3 h-3" />
                   Raw Environment
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-white/10 text-white/50 hover:text-white transition-all"
                  title="Copy to Clipboard"
                >
                   {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
             </div>
             <div className="flex-grow pt-4">
                <Editor
                   height="100%"
                   defaultLanguage="markdown"
                   theme="vs-dark"
                   value={markdown}
                   onChange={(value) => setMarkdown(value || "")}
                   options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 20, bottom: 20 },
                      wordWrap: "on",
                      fontFamily: "Space Grotesk, monospace",
                      scrollbar: {
                         verticalScrollbarSize: 8,
                         horizontalScrollbarSize: 8
                      }
                   }}
                />
             </div>
          </div>

          {/* Render Chamber */}
          <div className="bg-background flex flex-col min-h-[600px]">
             <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-3 opacity-50 uppercase font-black text-[10px] tracking-widest">
                <Monitor className="w-3 h-3" />
                Adaptive Render
             </div>
             <div className="flex-grow p-8 md:p-12 overflow-auto custom-scrollbar bg-background">
                <div className={cn(
                  "prose max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase",
                  "prose-p:leading-relaxed prose-li:leading-relaxed",
                  "prose-pre:rounded-none prose-pre:border prose-pre:border-border prose-pre:bg-muted/30 prose-pre:p-0",
                  "prose-img:rounded-none prose-img:border prose-img:border-border",
                  "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/10 prose-blockquote:py-1 prose-blockquote:px-6",
                  "prose-table:border prose-table:border-border prose-table:overflow-hidden",
                  "prose-th:bg-muted prose-th:p-4 prose-td:p-4 prose-td:border-t prose-td:border-border",
                  "dark:prose-invert"
                )}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Technical Summary */}
        <div className="flex items-center justify-between p-6 border border-border bg-muted/10">
           <div className="flex items-center gap-4 opacity-40">
              <div className="flex gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                 <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">AETHER_MD_ENGINE_v4.0.1_STABLE</span>
           </div>
           <div className="text-[9px] font-black uppercase tracking-widest text-primary/40">
              Characters: {markdown.length} | Lines: {markdown.split('\n').length}
           </div>
        </div>
      </div>
    </PageLayout>
  )
}
