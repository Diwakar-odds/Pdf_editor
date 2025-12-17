# 📄 PDF Editor

A modern, browser-based PDF editor built with React, TypeScript, and Vite. Edit PDFs directly in your browser with an intuitive interface featuring drawing tools, text annotations, and more.

![PDF Editor](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 📁 **PDF Upload & Management** - Load PDFs from your local machine or try with a sample PDF
- ✏️ **Drawing Tools** - Draw freehand annotations directly on PDF pages
- 📝 **Text Annotations** - Add custom text with adjustable size and color
- 🎨 **Customization** - Change colors, adjust sizes, and configure properties
- 🔄 **Multi-page Support** - Navigate and edit multiple pages seamlessly
- 💾 **Export** - Save your edited PDFs with all annotations preserved
- 🖱️ **Intuitive UI** - Modern, responsive interface built with Tailwind CSS
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pdf-editor.git
cd pdf-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 📦 Tech Stack

### Core
- **React 19.2** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### PDF Handling
- **pdf-lib** - PDF manipulation and creation
- **react-pdf** - PDF rendering in React

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### State Management
- **Zustand** - Lightweight state management

### Routing
- **React Router** - Client-side routing

## 📁 Project Structure

```
pdf-editor/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── layout/    # Layout components
│   │   └── ui/        # UI primitives (Button, Card)
│   ├── features/      # Feature-specific components
│   │   ├── editor/    # Editor components (Canvas, Toolbar, etc.)
│   │   └── home/      # Home page components
│   ├── pages/         # Page components
│   ├── store/         # Zustand state management
│   ├── lib/           # Utility functions
│   └── assets/        # Static assets
├── public/            # Public static files
└── ...config files    # Configuration files
```

## 🎯 Usage

1. **Upload a PDF**: Click "Upload PDF" on the home page or try the sample PDF
2. **Select a Tool**: Choose from Select, Draw, or Text tools in the sidebar
3. **Edit**: 
   - **Draw**: Click and drag to draw freehand annotations
   - **Text**: Click to add text boxes, customize in the properties panel
   - **Select**: Click elements to select and modify them
4. **Customize**: Use the properties panel to adjust colors, sizes, and more
5. **Navigate**: Use the bottom bar to switch between pages
6. **Save**: Export your edited PDF when done

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- PDF handling powered by [pdf-lib](https://pdf-lib.js.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ using React + TypeScript + Vite
