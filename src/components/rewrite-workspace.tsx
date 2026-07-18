// src/components/rewrite-workspace.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  FileText, 
  Sliders, 
  CornerDownRight, 
  Trash2,
  FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RewriteWorkspace() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("same");
  const [creativity, setCreativity] = useState(0.7);
  const [model, setModel] = useState("openai");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, tone, length, creativity, modelProvider: model }),
      });
      const data = await response.json();
      if (data.transformedText) {
        setOutputText(data.transformedText);
      } else if (data.error) {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#0F172A] text-slate-100 p-6 flex flex-col gap-6">
      {/* Dynamic Workspace Control Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-400 w-5 h-5" /> WriteFlow Workspace
          </h1>
          <p className="text-xs text-slate-400">Refine text processing structures instantly with adaptive generative models.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">AI Engine model</label>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:indigo-500"
            >
              <option value="openai">GPT-4o (OpenAI)</option>
              <option value="anthropic">Claude 3.5 Sonnet</option>
              <option value="gemini">Gemini 2.5 Pro</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Tone Mapping</label>
            <select 
              value={tone} 
              onChange={(e) => setTone(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:indigo-500"
            >
              <option value="professional">Professional</option>
              <option value="formal">Formal</option>
              <option value="academic">Academic</option>
              <option value="creative">Creative</option>
              <option value="simple">Simple</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Length Profile</label>
            <select 
              value={length} 
              onChange={(e) => setLength(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:indigo-500"
            >
              <option value="same">Preserve Length</option>
              <option value="shorter">Condense / Shorter</option>
              <option value="longer">Expand / Longer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Split Text Engine Core Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-stretch">
        
        {/* Left Side: Source Frame Panel */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col p-4 focus-within:border-indigo-500/50 transition-all duration-300">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800/60">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Source Document
            </span>
            <span className="text-[11px] text-slate-500">{inputText.split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            className="w-full flex-1 min-h-[350px] lg:min-h-[500px] bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none leading-relaxed"
            placeholder="Paste your source text matrix context or drop raw copy here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={() => setInputText("")} 
              className="text-slate-500 hover:text-rose-400 text-xs px-2 py-1 h-auto"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear Panel
            </Button>
            
            <Button
              onClick={handleRewrite}
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg text-xs font-medium tracking-wide transition-all px-4 py-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> Working...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-2" /> Execute Transformation
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Side: Output Frame Pipeline */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col p-4 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-indigo-950/10 transition-all duration-300">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800/60">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wide flex items-center gap-1.5">
              <CornerDownRight className="w-3.5 h-3.5 text-indigo-400" /> Refined Text Generation
            </span>
            <span className="text-[11px] text-slate-500">{outputText.split(/\s+/).filter(Boolean).length} words</span>
          </div>

          {isLoading ? (
            <div className="flex-1 flex flex-col gap-3 justify-center p-4">
              <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-slate-800 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-slate-800 rounded animate-pulse w-4/5" />
            </div>
          ) : (
            <div className="w-full flex-1 min-h-[350px] lg:min-h-[500px] text-sm text-slate-200 leading-relaxed overflow-y-auto whitespace-pre-wrap selection:bg-indigo-500/30">
              {outputText || (
                <span className="text-slate-600 italic">Transformed product variant strings output display container workspace asset layer.</span>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-slate-800/60 flex justify-end gap-2 items-center">
            <Button
              variant="outline"
              onClick={handleCopyToClipboard}
              disabled={!outputText}
              className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs h-9"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Output
                </>
              )}
            </Button>

            <Button
              variant="outline"
              disabled={!outputText}
              className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs h-9"
            >
              <FileDown className="w-3.5 h-3.5 mr-1.5" /> Export DOCX
            </Button>
          </div>
        </div>

      </div>

      {/* Creativity / Temperature Calibration Footer Layer */}
      <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800 flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400 text-xs shrink-0">
          <Sliders className="w-4 h-4 text-purple-400" /> Variance Calibration Slider (Temperature)
        </div>
        <input 
          type="range" 
          min="0.0" 
          max="1.0" 
          step="0.1" 
          value={creativity}
          onChange={(e) => setCreativity(parseFloat(e.target.value))}
          className="w-full max-w-md accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs font-mono text-indigo-400">{creativity}</span>
      </div>
    </div>
  );
}