# Gemini API Key Setup

To enable live analysis in the Tutor Dashboard, you need a Google Gemini API key. This guide explains how to obtain, configure, and secure your API key.

## 1. Obtain an API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google account.
3.  Click on **"Get API key"** in the sidebar.
4.  Click **"Create API key in new project"** (or select an existing Google Cloud project).
5.  Copy the generated API key.

## 2. Local Configuration

For local development, use a `.env` file in the root of the project:

1.  Create a file named `.env` in the root directory (you can copy `.env.example`).
2.  Add your API key:
    ```env
    PUBLIC_GEMINI_API_KEY=your_actual_key_here
    ```

SvelteKit will automatically load this variable during development.

## 3. Deployment Configuration

When deploying to GitHub Pages or another static hosting service, the API key must be available during the build process.

### GitHub Actions (GitHub Pages)

1.  Go to your repository on GitHub.
2.  Navigate to **Settings > Secrets and variables > Actions**.
3.  Add a new **Repository secret**:
    *   **Name**: `PUBLIC_GEMINI_API_KEY`
    *   **Secret**: (Paste your API key)
4.  Update your workflow (e.g., `.github/workflows/deploy.yml`) to include the environment variable in the build step:

```yaml
      - name: Build
        run: npm run build
        env:
          PUBLIC_GEMINI_API_KEY: ${{ secrets.PUBLIC_GEMINI_API_KEY }}
          # ... other env vars
```

## 4. Security Considerations

### Why the `PUBLIC_` prefix?

In SvelteKit, environment variables prefixed with `PUBLIC_` are accessible to the client-side code (the browser). 

This application is a **Static Site**, meaning it runs entirely in the user's browser without a backend server. To perform Gemini analysis, the browser must call the Google Gemini API directly. Therefore, the API key must be available to the browser.

### How to Secure a "Public" Key

Since the key is technically visible to anyone inspecting the network traffic of your website, you **MUST** restrict it to prevent unauthorized use by others.

#### Restrict the key to your domain:

1.  Go to the [Google Cloud Console Credentials page](https://console.cloud.google.com/apis/credentials).
2.  Select the project you used in AI Studio.
3.  Click on the name of your API key (e.g., "Generative Language Client").
4.  Under **Set an application restriction**, select **Websites**.
5.  Under **Website restrictions**, click **Add**.
6.  Enter your website's URL pattern. For GitHub Pages, it usually looks like:
    *   `https://yourusername.github.io/your-repo-name/*`
    *   If you have a custom domain, use that instead.
7.  Under **API restrictions**, select **Restrict key**.
8.  From the dropdown, select **Generative Language API** (this is the API for Gemini).
9.  Click **Save**.

By applying these restrictions, the API key will only work when the request originates from your specific domain and is only used for Gemini services.
