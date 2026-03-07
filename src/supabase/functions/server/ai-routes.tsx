// S04-AI — AI analysis Edge Function routes
// analyze-business, industry-diagnostics, system-recommendations,
// readiness-score, generate-roadmap

import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { callGemini } from "./gemini.tsx";

const ai = new Hono();
const PREFIX = "/make-server-283466b6";

// ── POST /analyze-business ──
ai.post(`${PREFIX}/analyze-business`, async (c) => {
  try {
    const body = await c.req.json();
    const { url, description, industry, sessionId } = body;

    if (!description && !url) {
      return c.json(
        { error: "Either url or description is required for analysis" },
        400
      );
    }

    const systemPrompt = `You are a senior business analyst at Sun AI Agency. Analyze the company information provided and return a structured JSON analysis.

Return this exact JSON structure:
{
  "companySummary": "2-3 sentence company overview",
  "detectedIndustry": "most likely industry sector",
  "productsServices": ["list of key products/services"],
  "teamSizeEstimate": "estimated team size range",
  "technologySignals": ["detected technologies"],
  "aiOpportunities": ["top 4 AI opportunities"],
  "competitivePosition": "brief competitive analysis",
  "readinessIndicators": {
    "digital_maturity": "low|medium|high",
    "automation_level": "none|basic|moderate|advanced",
    "data_readiness": "low|medium|high"
  }
}`;

    const userPrompt = `Analyze this business:
${url ? `Website URL: ${url}` : ""}
${description ? `Description: ${description}` : ""}
${industry ? `Industry hint: ${industry}` : ""}

Provide a thorough analysis considering the business context, market position, and AI transformation potential.`;

    const result = await callGemini("analyze-business", systemPrompt, userPrompt, {
      url,
      description,
      industry,
    });

    // Persist analysis to session if provided
    if (sessionId) {
      await kv.set(`wizard:analysis:${sessionId}`, {
        result,
        analyzedAt: new Date().toISOString(),
      });
    }

    console.log(
      `[AI] analyze-business complete for ${url || "description-only"}`
    );

    return c.json({
      success: true,
      analysis: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(`[AI] analyze-business error: ${error}`);
    return c.json(
      {
        error: `Business analysis failed: ${error}`,
        fallback: true,
      },
      500
    );
  }
});

// ── POST /industry-diagnostics ──
ai.post(`${PREFIX}/industry-diagnostics`, async (c) => {
  try {
    const body = await c.req.json();
    const { industryId, companyProfile, sessionId } = body;

    if (!industryId) {
      return c.json({ error: "industryId is required" }, 400);
    }

    const systemPrompt = `You are an AI diagnostics specialist at Sun AI Agency. Generate industry-specific diagnostic insights based on the company profile and industry.

Return this JSON structure:
{
  "painPoints": [
    { "id": "string", "label": "pain point name", "severity": "high|medium|low", "description": "brief description" }
  ],
  "opportunities": [
    { "id": "string", "label": "opportunity name", "potentialROI": "percentage range", "description": "brief description" }
  ],
  "benchmarks": {
    "industryAverage": "key industry metrics",
    "topPerformers": "what leaders do differently"
  },
  "priorityActions": ["top 3 recommended immediate actions"]
}`;

    const userPrompt = `Industry: ${industryId}
Company Profile: ${JSON.stringify(companyProfile || {})}

Analyze this business in the context of their industry and provide diagnostic insights with actionable recommendations.`;

    const result = await callGemini(
      "industry-diagnostics",
      systemPrompt,
      userPrompt,
      { industryId, companyProfile }
    );

    if (sessionId) {
      await kv.set(`wizard:diagnostics:${sessionId}`, {
        result,
        analyzedAt: new Date().toISOString(),
      });
    }

    console.log(`[AI] industry-diagnostics complete for ${industryId}`);

    return c.json({
      success: true,
      diagnostics: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(`[AI] industry-diagnostics error: ${error}`);
    return c.json(
      { error: `Industry diagnostics failed: ${error}`, fallback: true },
      500
    );
  }
});

// ── POST /system-recommendations ──
ai.post(`${PREFIX}/system-recommendations`, async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId, wizardAnswers, industry, signals } = body;

    const systemPrompt = `You are an AI systems architect at Sun AI Agency. Based on the wizard answers and diagnostic signals, rank and recommend AI systems.

Available systems: support-engine, growth-engine, operations-autopilot, data-intelligence, content-engine, onboarding-system, cart-recovery, recommendation-engine, sales-automation, loyalty-system, booking-engine, compliance-automation

Return this JSON structure:
{
  "rankedSystems": [
    {
      "systemId": "string",
      "rank": 1,
      "fitScore": 0.95,
      "personalizedWhy": "why this system fits their specific situation",
      "expectedROI": "projected ROI range",
      "quickWin": true
    }
  ],
  "combinedStrategy": "2-3 sentence strategic overview",
  "implementationOrder": ["systemId1", "systemId2"],
  "estimatedTimeline": "total weeks",
  "investmentTier": "starter|growth|enterprise"
}`;

    const userPrompt = `Wizard answers: ${JSON.stringify(wizardAnswers || {})}
Industry: ${industry || "unknown"}
Diagnostic signals: ${JSON.stringify(signals || [])}

Rank and recommend the most impactful AI systems for this business, considering their industry, maturity level, and stated challenges.`;

    const result = await callGemini(
      "system-recommendations",
      systemPrompt,
      userPrompt,
      { wizardAnswers, industry, signals }
    );

    if (sessionId) {
      await kv.set(`wizard:recommendations:${sessionId}`, {
        result,
        generatedAt: new Date().toISOString(),
      });
    }

    console.log(`[AI] system-recommendations complete`);

    return c.json({
      success: true,
      recommendations: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(`[AI] system-recommendations error: ${error}`);
    return c.json(
      { error: `System recommendations failed: ${error}`, fallback: true },
      500
    );
  }
});

// ── POST /readiness-score ──
ai.post(`${PREFIX}/readiness-score`, async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId } = body;

    // Load all session data
    let sessionData: any = {};
    if (sessionId) {
      const [session, analysis, diagnostics] = await kv.mget([
        `wizard:session:${sessionId}`,
        `wizard:analysis:${sessionId}`,
        `wizard:diagnostics:${sessionId}`,
      ]);
      sessionData = { session, analysis, diagnostics };
    }

    const systemPrompt = `You are an AI readiness assessment expert at Sun AI Agency. Calculate an AI readiness score based on all available data about the business.

Return this JSON structure:
{
  "overallScore": 72,
  "scoreBreakdown": {
    "digitalMaturity": { "score": 80, "label": "Digital Infrastructure" },
    "dataReadiness": { "score": 65, "label": "Data & Analytics" },
    "processAutomation": { "score": 70, "label": "Process Automation" },
    "teamCapability": { "score": 75, "label": "Team & Culture" },
    "strategicAlignment": { "score": 68, "label": "Strategic Alignment" }
  },
  "maturityLevel": "developing|emerging|established|advanced",
  "gaps": [
    { "area": "gap area", "description": "what's missing", "priority": "high|medium|low" }
  ],
  "strengths": ["key strength 1", "key strength 2"],
  "nextSteps": ["recommended next step 1", "recommended next step 2"]
}`;

    const userPrompt = `Full session data: ${JSON.stringify(sessionData)}

Assess this company's AI readiness based on all available information. Be specific and actionable in your recommendations.`;

    const result = await callGemini(
      "readiness-score",
      systemPrompt,
      userPrompt,
      { sessionId, sessionData }
    );

    if (sessionId) {
      await kv.set(`wizard:readiness:${sessionId}`, {
        result,
        scoredAt: new Date().toISOString(),
      });
    }

    console.log(`[AI] readiness-score complete: ${JSON.stringify(result).slice(0, 100)}`);

    return c.json({
      success: true,
      readiness: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(`[AI] readiness-score error: ${error}`);
    return c.json(
      { error: `Readiness scoring failed: ${error}`, fallback: true },
      500
    );
  }
});

// ── POST /generate-roadmap ──
ai.post(`${PREFIX}/generate-roadmap`, async (c) => {
  try {
    const body = await c.req.json();
    const { sessionId, selectedSystems, industry, companySize } = body;

    if (!selectedSystems || selectedSystems.length === 0) {
      return c.json({ error: "At least one system must be selected" }, 400);
    }

    const systemPrompt = `You are a senior project manager at Sun AI Agency. Create a phased implementation roadmap for the selected AI systems.

Return this JSON structure:
{
  "title": "AI Transformation Roadmap for [Company]",
  "totalWeeks": 12,
  "totalInvestment": "$XX,XXX - $XX,XXX",
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Foundation",
      "weekRange": "Weeks 1-4",
      "systems": ["systemId1"],
      "deliverables": ["deliverable 1", "deliverable 2"],
      "milestones": ["milestone 1"],
      "estimatedCost": "$X,XXX",
      "teamInvolvement": "description of team needs"
    }
  ],
  "quickWins": ["quick win 1", "quick win 2"],
  "riskFactors": [
    { "risk": "risk description", "mitigation": "how to mitigate" }
  ],
  "successMetrics": [
    { "metric": "metric name", "target": "target value", "timeframe": "by when" }
  ]
}`;

    const userPrompt = `Selected systems: ${JSON.stringify(selectedSystems)}
Industry: ${industry || "unknown"}
Company size: ${companySize || "unknown"}

Create a realistic, phased implementation roadmap. Consider dependencies between systems, team capacity, and quick wins. Be specific about timelines and deliverables.`;

    const result = await callGemini(
      "generate-roadmap",
      systemPrompt,
      userPrompt,
      { selectedSystems, industry, companySize }
    );

    if (sessionId) {
      await kv.set(`wizard:roadmap:${sessionId}`, {
        result,
        generatedAt: new Date().toISOString(),
      });
    }

    console.log(`[AI] generate-roadmap complete for ${selectedSystems.length} systems`);

    return c.json({
      success: true,
      roadmap: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(`[AI] generate-roadmap error: ${error}`);
    return c.json(
      { error: `Roadmap generation failed: ${error}`, fallback: true },
      500
    );
  }
});

export { ai };
