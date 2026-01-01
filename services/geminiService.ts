
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables as required
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTenantNotice = async (type: string, details: string, signature?: string) => {
  const defaultSignature = `The Infinite Group Management Team
1500 N. Grant St. Suite C, Aurora, Co. 80203
Phone: 720.271.3556
Email: admin@theinfintegroup.net`;

  const finalSignature = signature || defaultSignature;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a professional and formal ${type} notice for a tenant. Additional context and specifics: ${details}. 
    
    GUIDELINES:
    1. Format it as a formal letter with "Dear [Tenant Name],".
    2. Maintain a professional, executive, yet fair tone (consistent with high-end property management).
    3. If this is a LEASE_RENEWAL notice, ensure it highlights that the tenant can review the proposed terms and sign digitally via their Tenant Portal.
    4. If it mentions late fees, ensure the tone remains firm but respectful.
    5. DO NOT include placeholders like "[Your Name]" at the end. Use the provided signature EXACTLY.
    
    Use the following exact signature/contact block at the end:
    ${finalSignature}`,
    config: {
      temperature: 0.7,
    }
  });
  return response.text;
};

export const generateSmartReminder = async (dayOfMonth: number, tenantName: string, status: string, totalDue: number) => {
  let tone = "polite and helpful";
  let urgency = "low";
  
  if (dayOfMonth > 5) {
    tone = "firm, professional, and legalistic";
    urgency = "critical";
  } else if (dayOfMonth >= 4) {
    tone = "urgent but courteous";
    urgency = "high";
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a short (2-3 sentence) smart reminder for a tenant named ${tenantName}. 
    Today's Date: Day ${dayOfMonth} of the month.
    Tenant Status: ${status}.
    Balance Due: $${totalDue}.
    Tone: ${tone}.
    Urgency: ${urgency}.
    Context: Rent is due on the 1st. Grace period ends on the 5th. Late fees apply on the 6th ($50 initial + $10/day).
    Provide only the message body for an SMS or App notification.`,
    config: {
      temperature: 0.6,
    }
  });
  return response.text;
};

export const summarizeOwnerReport = async (reportData: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the following financial property report for an owner: ${JSON.stringify(reportData)}. Highlight key performance indicators, revenue growth, and any areas for attention. Keep it concise and professional. Mention that management fees are set at 10% per the management agreement. Mention late fee enforcement status if policy context is provided: ${reportData.policyContext || 'N/A'}.`,
    config: {
      temperature: 0.4,
    }
  });
  return response.text;
};

export const generateBackgroundReport = async (applicantName: string, income: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Simulate a comprehensive background and credit check report for a rental applicant named ${applicantName} who claims an income of ${income}. 
    The report should include:
    1. Credit Score Range (Simulated)
    2. Criminal Record Check (Clean/Findings)
    3. Eviction History
    4. Employment Verification
    5. A 'Manager's Recommendation' signed by The Infinite Group Compliance Team.
    
    Make it look like a professional screening document. This is for a property management software demonstration.`,
    config: {
      temperature: 0.8,
    }
  });
  return response.text;
};

export const handleAssistantQuery = async (query: string, signature?: string) => {
  const defaultSignature = `The Infinite Group Management Team
1500 N. Grant St. Suite C, Aurora, Co. 80203
Phone: 720.271.3556
Email: admin@theinfintegroup.net`;

  const finalSignature = signature || defaultSignature;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a professional property management assistant for 'The Infinite Group'. 
    
    YOUR CONTACT INFORMATION (Use this in responses if asked for contact info or to sign off):
    ${finalSignature}
    
    - Application Fee: $100.00 (Mandatory, Non-Refundable). This applies to all applicants.
    
    LATE FEE POLICY (CRITICAL):
    - Rent is due on the 1st of every month.
    - Grace period: 1st through the 5th. No fees applied if paid by 5:00 PM on the 5th.
    - Late Day 6: A flat $50.00 late fee is automatically applied.
    - Day 7 and onward: An additional $10.00 per day is added until the balance is paid.
    - Maximum Cap: Total late fees will not exceed $300.00 for a single billing cycle.
    
    CURRENT PROPERTY PORTFOLIO STATUS:
    
    For Infinite REI, LLC (Portfolio Inventory):
    - 1607 Vaughn St.: LEASED (Aaliyah Fox - $900)
    - 1609 Vaughn St.: LEASED (Angela Jackson - $725)
    - 1604 W. 9th: LEASED (Janine Maxwell - $825)
    - 1201 S. Hickory St: VACANT & AVAILABLE
    - 502 S Missouri St.: VACANT & AVAILABLE
    - 4028 W 16th Ave: VACANT & AVAILABLE
    - 2015 W. 26th Ave: VACANT & AVAILABLE
    - 2017 W. 26th: VACANT & AVAILABLE
    
    For LaTherese Ellis:
    - 5 Pine Place: Occupied (Adrienne Dirk)
    - 2006 W. 17th: Vacant
    - 2008 W. 17th: Vacant
    - 1215 W. 17th: Vacant
    - 1217 W. 17th: Vacant
    
    For Bridget Holmes-Merguez:
    - 3607 Missouri St. Pine Bluff, Ar. 71601: VACANT & AVAILABLE FOR RENT
    
    Answer the following user question using this specific policy and property context: ${query}`,
    config: {
      temperature: 0.7,
    }
  });
  return response.text;
};
