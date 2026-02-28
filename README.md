# CloudGraph 3D

A production-ready 3D interactive force-directed graph visualizing **AWS** and **Azure** cloud services and their cross-cloud compatibility relationships.

![CloudGraph 3D](https://img.shields.io/badge/CloudGraph-3D-amber?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite)

## Features

- **3D force-directed graph** – Interactive exploration of AWS and Azure services
- **Cross-cloud compatibility** – Visual mapping of equivalent services (EC2 ↔ Azure VM, S3 ↔ Blob, etc.)
- **Filtering** – Provider, category, region, preview, and cross-cloud-only filters
- **Search** – Autocomplete search with camera fly-to selected node
- **Node details panel** – Service info, regions, connected services, cross-cloud equivalents
- **Dark futuristic UI** – Glassmorphism panels, smooth animations, responsive layout

## Tech Stack

- **React** 19 + **TypeScript**
- **Vite** 7
- **TailwindCSS** 4
- **react-force-graph-3d** + **three.js**
- **Zustand** (state management)

No backend. All data from static JSON.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Build for Production

```bash
npm run build
```

Output is in `/dist`. Configured for GitHub Pages with base path `/cloudgraph-3d/`.

## Deploy to GitHub Pages

1. **Enable GitHub Pages**  
   - Repo → Settings → Pages  
   - Source: **GitHub Actions**

2. **Push to `main`**  
   The workflow `.github/workflows/deploy.yml` builds and deploys automatically.

3. **View**  
   App is available at:  
   `https://<username>.github.io/cloudgraph-3d/`

## Project Structure

```
cloudgraph-3d/
├── public/
│   └── data/
│       └── graph.json      # AWS + Azure services and relationships
├── src/
│   ├── components/
│   │   ├── ForceGraph3D.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── NodeDetailsPanel.tsx
│   │   └── LoadingSpinner.tsx
│   ├── store/
│   │   └── useAppStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── filterGraph.ts
│   │   └── extractMeta.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── scripts/
│   └── generate-graph-data.mjs
└── vite.config.ts
```

## Graph Data Format

`/public/data/graph.json`:

```json
{
  "nodes": [
    {
      "id": "aws_ec2",
      "name": "Amazon EC2",
      "provider": "AWS",
      "category": "Compute",
      "preview": false,
      "regions": ["us-east-1"],
      "description": "Virtual servers in the cloud",
      "crossCloudCompatible": ["azure_vm"]
    }
  ],
  "links": [
    { "source": "aws_ec2", "target": "aws_vpc", "type": "intra-cloud", "weight": 1 },
    { "source": "aws_ec2", "target": "azure_vm", "type": "cross-cloud", "weight": 2 }
  ]
}
```

## Regenerating Graph Data

```bash
node scripts/generate-graph-data.mjs > public/data/graph.json
```

## License

MIT
