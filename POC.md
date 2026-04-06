# Proof of Concept (PoC) Definition: AI Tutoring Companion

This document outlines a minimal Proof of Concept (PoC) designed to validate the core value proposition of the AI Tutoring Companion. The goal is to build just enough to assess whether the AI can accurately identify knowledge gaps from tutoring session media and successfully guide a student through those gaps interactively.

## 1. Objective of the PoC
To validate that replacing manual homework assignment with an AI-driven, interactive post-session tutoring experience is effective and feasible, without needing to build complex real-time streaming infrastructure.

## 2. Scope & Simplifications
- **No Live Audio/Video Streaming:** Processing real-time streaming data is complex. For this PoC, we will simulate a live session's output using a static image (representing the final state of the whiteboard) and a text transcript (representing the conversation).
- **Single AI Provider:** We will rely on a state-of-the-art multimodal model (e.g., Google's Gemini 1.5 Pro) capable of natively processing both images and text simultaneously.
- **Focus on Core Loop:** The system will only feature two isolated, sequential views: Analysis (for the Tutor) and Interactive Tutoring (for the Student).

## 3. Workflow & Technical Approach

The PoC will be a simple web application featuring two distinct workflows:

### A. The Tutor Dashboard (Analysis Phase)
This phase proves the AI can accurately contextualize visual problem-solving alongside verbal instruction to identify errors or confusion.

- **Input:** A bare-bones form where the tutor can upload an image (e.g., a math problem worked out on a whiteboard) and paste a simulated text transcript of the conversational audio.
- **Processing:** The system calls the multimodal AI with a prompt instructing it to act as an expert diagnostician. It analyzes the image and transcript holistically.
- **Output:** The UI displays:
  1. Identified **"Knowledge Gaps"** (e.g., "Student forgot to distribute the negative sign").
  2. A **"Proposed Interactive Problem"** designed specifically to target those exact gaps.

### B. The Student Workspace (Interactive Phase)
This phase proves the AI can effectively act as a tutor, using the Socratic method rather than just providing answers.

- **Input:** The student is presented with the problem generated in the previous phase.
- **Interaction:** A chat interface where the student can communicate with the AI to work through the new problem.
- **AI Persona Constraints:** The system prompt for this chat context will strictly instruct the AI to **never** give away the answer directly. It must guide the student step-by-step, heavily leaning on the context of the gaps identified in Phase A.

## 4. Verification & Success Criteria
Anna and other stakeholders can manually assess the system's effectiveness through the following steps:
1. **Analyze:** Upload a sample math problem image and transcript to the Tutor Dashboard. Verify the AI accurately extracts the true conceptual gap and proposes a relevant homework problem.
2. **Solve:** Switch to the Student Workspace. Attempt to solve the proposed problem incorrectly, intentionally falling into the same trap. Verify the AI nudges the user conceptually to realize their mistake without spoon-feeding the solution.

## 5. Potential Technology Stack
- **Frontend/Backend:** Next.js or SvelteKit (for seamless API routes alongside the UI).
- **AI Integration:** Google Gen AI SDK for Node.js (`@google/genai`).
- **Styling:** Tailwind CSS for rapid prototyping of the chat and dashboard views.
