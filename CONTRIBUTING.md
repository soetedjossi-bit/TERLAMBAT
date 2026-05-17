# Contributing to PresensiApp

Thank you for your interest in contributing! 🎉

## How to Contribute

### 1. Fork the Repository
```bash
git clone https://github.com/soetedjossi-bit/TERLAMBAT.git
cd TERLAMBAT
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Keep code clean and readable
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting

### 4. Commit Your Changes
```bash
git commit -m "feat: add your feature description"
```

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
- Provide clear description
- Reference any related issues
- Include screenshots if applicable

## Code Style

### JavaScript
```javascript
// Use descriptive names
function handleAttendanceSubmit(event) {
    event.preventDefault();
    // ...
}

// Use comments for clarity
// Send data to Google Sheet
async function sendToGoogleSheet(data) {
    // ...
}
```

### CSS
```css
/* Use CSS variables */
:root {
    --primary: #6366f1;
    --success: #10b981;
}

/* Use meaningful class names */
.attendance-item {
    /* ... */
}
```

### HTML
```html
<!-- Use semantic HTML -->
<section class="attendance-list">
    <h2>Presensi Terbaru</h2>
    <!-- ... -->
</section>
```

## Commit Message Format

```
type: subject

body

footer
```

### Types:
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions/changes

### Example:
```
feat: add email notification feature

Implement email notifications for attendance alerts.
Users can now receive email reports daily.

Closes #123
```

## Reporting Issues

### Before Creating an Issue
1. Check if issue already exists
2. Try clearing browser cache
3. Test in different browser
4. Read documentation

### Creating an Issue
1. Use clear, descriptive title
2. Provide detailed description
3. Include steps to reproduce
4. Add screenshots/videos if applicable
5. Mention browser & OS

### Issue Template
```markdown
## Description
[Clear description of the issue]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Version: 1.0.0
```

## Pull Request Guidelines

1. **Small, focused PRs** are better than large ones
2. **One feature per PR** when possible
3. **Test before submitting**
4. **Update documentation** if needed
5. **Follow existing code style**
6. **Add meaningful commit messages**

## Review Process

1. We'll review your PR within 48 hours
2. May request changes or improvements
3. Once approved, your PR will be merged
4. Merged PRs will be included in next release

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub insights page

## Questions?

Feel free to:
- Open a discussion issue
- Contact the maintainers
- Email: soetedjo.ssi@gmail.com

---

**Thank you for helping make PresensiApp better! ❤️**
