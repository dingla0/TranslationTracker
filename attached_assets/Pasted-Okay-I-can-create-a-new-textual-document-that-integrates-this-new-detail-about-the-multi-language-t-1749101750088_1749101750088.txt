Okay, I can create a new textual document that integrates this new detail about the multi-language translation workflow. This updated overview will incorporate information from the previously provided PDF, citing it where appropriate, and include the new workflow information you've just given.

Here is the revised overview:

---

**Translation Management System (TMS) - Revised Overview**

**1. Introduction**
[cite_start]This platform is a modular, scalable Translation Management System (TMS) designed to manage, translate, and distribute weekly Bible study forum content[cite: 1]. [cite_start]It supports manual translation workflows, glossary/terminology management, machine translation (utilizing Azure Translator), and real-time collaboration features[cite: 2].

**2. Core Translation Workflow**
The primary translation path involves converting content from Korean to English. Once the English translation is finalized, it then serves as the source text for subsequent translations into a range of other languages. These target languages include: Tagalog, Burmese, Cebuano, Czech, Deutsch (German), Ewe, Spanish, French, Hmong, Ilocano, Japanese, Chinese, Mongolian, Nepali, Portuguese, Russian, Thai, and Vietnamese.

**3. Modules Overview**

* **Content Intake + Management**
    * [cite_start]The system allows for uploading or linking weekly Korean forum videos[cite: 3].
    * [cite_start]It manages structured metadata such as event, topic, and date[cite: 3].
    * [cite_start]Korean transcriptions can be edited and stored within the platform[cite: 4].
* **Collaborative Translation Workspace**
    * [cite_start]Features a side-by-side bilingual editor, initially for Korean and English[cite: 5]. This editor can be adapted for translating English content into other languages.
    * [cite_start]Supports real-time editing and commenting functionalities[cite: 5].
    * [cite_start]Includes task assignment capabilities and role-based permissions for users[cite: 5].
* **Terminology & Translation Memory**
    * [cite_start]Incorporates a Translation Memory (TM) to auto-suggest translations based on past work[cite: 6].
    * [cite_start]A Termbase/Glossary is used to manage and ensure consistency for key terms[cite: 6].
    * [cite_start]Entries are searchable, taggable, and include version tracking[cite: 7].
* **Pipeline Dashboard**
    * [cite_start]Allows users to track translation progress for each language and content piece[cite: 8].
    * [cite_start]Provides a visual status of translations (e.g., Pending → In Progress → Reviewed → Published)[cite: 8].
    * [cite_start]Content can be filtered by event, translator, deadline, or language[cite: 8].
* **Export & Distribution**
    * [cite_start]Supports exporting content to DOCX, PDF, TXT, and SRT formats[cite: 9].
    * [cite_start]Offers optional CMS integration for publishing via a REST API[cite: 9].
* **Live Interpretation Support (optional)**
    * [cite_start]Provides functionality to upload live interpretation audio/video[cite: 10].
    * [cite_start]Supports time-stamped annotations, archiving, and reuse of interpretations in the future[cite: 10].

**4. Tech Stack Overview**

* [cite_start]**AI / Machine Translation:** Includes Azure Translator (with Custom Translator + Phrase Dictionary), Azure ML for fine-tuning models, spaCy / Hugging Face for NLP and preprocessing, and evaluation metrics like BLEU, TER, alongside a human review loop[cite: 11].
* [cite_start]**Backend:** Built with Node.js (or Python FastAPI for AI-heavy tasks), using Express or NestJS framework, PostgreSQL for the database, WebSockets / Yjs for real-time synchronization, Azure Blob for storage, Azure Functions / BullMQ for task queues, and Azure API Management[cite: 11].
* [cite_start]**Frontend:** Developed with React + TypeScript, styled with Tailwind CSS, employing TipTap or Slate.js for the rich editor, and custom React components for features like translation suggestions, dashboard, and glossary[cite: 11].
* **Auxiliary Systems:** Authentication managed by Azure AD B2C or Firebase Auth; [cite_start]CI/CD through GitHub Actions + Azure App Service; email notifications via SendGrid (Azure); and monitoring with Azure Monitor and Application Insights[cite: 11].

**5. Project Structure**
[cite_start]The project is organized into `client/`, `server/`, `shared/`, `azure-functions/`, `db/`, and `.github/workflows/` directories, among others[cite: 12, 13].

**6. Getting Started**
[cite_start]Prerequisites include Node.js (≥ 18.x), PostgreSQL (≥ 14), an Azure Account (for Translator, Blob Storage, AD B2C), and Git + GitHub[cite: 14]. [cite_start]Environment setup involves configuring a `.env` file with necessary keys and endpoints[cite: 14].

**7. AI Training Workflow**
The workflow involves:
    1.  [cite_start]Collecting & Cleaning Data: Importing legacy spreadsheets and aligning source-target texts[cite: 15].
    2.  [cite_start]Preprocessing: Including tokenization and sentence alignment using tools like OpenNMT or Moses[cite: 16].
    3.  [cite_start]Fine-Tuning: Utilizing Azure Custom Translator or Hugging Face on Azure ML[cite: 17].
    4.  [cite_start]Evaluation: Assessing quality with BLEU, TER, and human review[cite: 17].
    5.  [cite_start]Deployment: Exporting the trained model into Azure Translator for production use[cite: 17].

**8. Export Formats**
The platform supports several export formats:
* [cite_start]`.docx`: For Word exports suitable for printing or further editing[cite: 18].
* [cite_start]`.pdf`: For clean, viewer-ready versions of the content[cite: 18].
* [cite_start]`.txt`: For plain text that can be easily imported into other systems[cite: 18].
* [cite_start]`.srt`: For video subtitles[cite: 18].
[cite_start]Export services utilize server-side tools such as `docx`, `pdfkit`, `subtitle`, and custom formatters[cite: 18].

**9. Glossary & TM Design**
* [cite_start]**Glossary:** Implemented as a table containing the term, its definition, usage examples, part-of-speech, and tags[cite: 19].
* [cite_start]**Translation Memory (TM):** Matches are based on sentence similarity and the presence of glossary terms[cite: 20].
* [cite_start]**Storage:** Leverages PostgreSQL combined with ElasticSearch to enable fuzzy search capabilities[cite: 20].

**10. Authentication**
* [cite_start]User authentication is handled via Azure AD B2C, which supports Single Sign-On (SSO) and group permissions[cite: 21].
* [cite_start]Defined roles include Admin, Korean Transcriber, English Translator, and Regional Translator[cite: 21]. The "Regional Translator" role is particularly relevant for managing translations from English into the various other supported languages.

**11. Roadmap**
[cite_start]The project roadmap includes the ongoing development and refinement of these modules and features[cite: 22]. The phased rollout of support for the extensive list of secondary languages post-English translation would be a key aspect of this roadmap.

**12. Contributors**
* [cite_start]Christian Ko - Product Owner / Translator Lead[cite: 22].
* [cite_start]ChatGPT - Technical Architect & AI Consultant[cite: 22].

**13. License**
[cite_start]The project is licensed under the MIT license, welcoming open-source contributions[cite: 22].

---