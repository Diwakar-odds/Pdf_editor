# Contributing to PDF Editor

Thank you for considering contributing to PDF Editor! We welcome contributions from everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Rationale** for the feature
- **Use cases** and examples
- **Mockups or sketches** if applicable

### Pull Requests

We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Ensure the code lints and builds successfully
4. Test your changes thoroughly
5. Update documentation if needed
6. Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup Steps

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/pdf-editor.git
   cd pdf-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Project Structure

```
src/
├── components/       # Reusable UI components
├── features/        # Feature-specific components
├── pages/           # Page components
├── store/           # State management
├── lib/             # Utility functions
└── assets/          # Static assets
```

## 🔄 Pull Request Process

1. **Branch Naming**
   - Feature: `feature/your-feature-name`
   - Bug fix: `fix/bug-description`
   - Documentation: `docs/description`
   - Refactor: `refactor/description`

2. **Before Submitting**
   - Run `npm run lint` and fix any issues
   - Run `npm run build` to ensure it builds successfully
   - Test your changes in multiple browsers if possible
   - Update relevant documentation

3. **PR Description**
   - Describe what changes you made and why
   - Reference any related issues
   - Include screenshots for UI changes
   - List any breaking changes

4. **Review Process**
   - Maintainers will review your PR
   - Address any feedback or requested changes
   - Once approved, your PR will be merged

## 💻 Coding Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type
- Use `const` and `let`, avoid `var`

### React

- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use meaningful component and variable names

### Styling

- Use Tailwind CSS utility classes
- Follow existing styling patterns
- Ensure responsive design
- Maintain consistent spacing and colors

### Code Quality

- Write clean, readable code
- Add comments for complex logic
- Remove console.logs before committing
- Handle errors appropriately

### Example Component

```tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
}
```

## 📝 Commit Message Guidelines

We follow conventional commits for clear history:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(editor): add undo/redo functionality

Implemented undo/redo using command pattern
Added keyboard shortcuts (Ctrl+Z, Ctrl+Y)

Closes #123
```

```
fix(canvas): resolve drawing offset issue

Fixed incorrect mouse position calculation
that caused drawings to appear offset

Fixes #456
```

## 🧪 Testing

- Test your changes manually
- Ensure existing functionality isn't broken
- Test in different browsers (Chrome, Firefox, Safari)
- Test responsive behavior on mobile devices

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ❓ Questions?

Feel free to open an issue for any questions or concerns. We're here to help!

## 🎉 Recognition

Contributors will be recognized in our README and release notes.

Thank you for contributing to PDF Editor! 🙌
