# Pixii Image Upgrader

An AI-powered image enhancement tool. Upload a photo, optionally describe how you want it enhanced, and get back a studio-quality result powered by the Claid.ai API.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** React 19, shadcn/ui, Radix UI
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion (motion)
- **Image Enhancement API:** [Claid.ai](https://claid.ai)
- **Other:** react-dropzone, Sonner (toasts), Lucide icons

## How It Works

1. User uploads a JPG or PNG image (max 4MB) via drag-and-drop or file picker.
2. Optionally, the user provides a text prompt describing the desired enhancement.
3. The frontend sends the image to the `/api/enhance` route.
4. The API route:
   - Uploads the image to Claid.ai to get a hosted URL.
   - Sends the hosted URL along with the prompt (or a default studio-quality prompt) to Claid.ai's scene creation endpoint.
   - Returns the enhanced image URL to the frontend.
5. The user previews the result and can download it.

The API route includes rate limiting (5 requests/min per IP) and request timeouts (30s).

## Project Structure

```
app/
├── page.tsx              # Landing page
├── design/page.tsx       # Photo upgrader UI
├── api/enhance/route.ts  # Image enhancement API route
├── layout.tsx            # Root layout
└── globals.css           # Global styles

components/
├── photo-upgrader.tsx    # Main upload + enhance component
├── navbar.tsx            # Navigation bar
├── footer.tsx            # Footer
├── dashed-grid.tsx       # Background grid pattern
├── landing/              # Landing page sections
└── ui/                   # shadcn/ui components
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Claid.ai](https://claid.ai) API key

### Setup

```bash
# Install dependencies
npm install

# Create .env.local and add your API key
echo "CLAID_API_KEY=your_api_key_here" > .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page. Navigate to `/design` to use the photo upgrader.

## Scripts

| Command            | Description               |
| ------------------ | ------------------------- |
| `npm run dev`      | Start development server  |
| `npm run build`    | Production build          |
| `npm run start`    | Start production server   |
| `npm run lint`     | Run ESLint                |
| `npm run lint:fix` | Run ESLint with auto-fix  |
| `npm run format`   | Format code with Prettier |

## License

MIT
