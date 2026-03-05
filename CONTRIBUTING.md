# Contributing to March Madness Leaderboard

Thank you for your interest in contributing! This project helps organizations run engaging competitions and tournaments.

## 🚀 Quick Start

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/march-madness-leaderboard.git`
3. Install dependencies: `npm install`
4. Start development: `npm run dev`
5. Open http://localhost:3000

### Making Changes
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes: `npm run build`
4. Commit with clear message: `git commit -m "feat: add new scoring system"`
5. Push: `git push origin feature/your-feature-name`
6. Create Pull Request

## 📋 Development Guidelines

### Code Standards
- **TypeScript** - Use proper typing
- **ESLint** - Follow linting rules
- **Prettier** - Format code consistently
- **Conventional Commits** - Use clear commit messages

### Commit Message Format
```
type(scope): description

Examples:
feat(dashboard): add real-time score updates
fix(bracket): resolve tournament progression bug
docs(readme): update deployment instructions
style(tv): improve display scaling for large screens
```

### Testing
```bash
# Build and test
npm run build

# Check for TypeScript errors
npm run type-check

# Run linting
npm run lint
```

## 🎯 Areas for Contribution

### High Priority
- **Mobile Optimization** - Improve touch interfaces
- **Accessibility** - Screen reader support, keyboard navigation
- **Performance** - Optimize bundle size and loading
- **Database Integration** - Add persistent data storage

### Feature Ideas
- **Multi-tournament Support** - Run concurrent competitions
- **Advanced Analytics** - Performance insights and trends
- **Social Features** - Comments, reactions, sharing
- **Customization** - Themes, branding, tournament formats

### Bug Fixes
- Cross-browser compatibility issues
- Mobile display problems
- Real-time sync inconsistencies
- Performance bottlenecks

## 🏆 Use Cases to Consider

### Business Applications
- Sales team competitions
- Training program gamification
- Corporate team building
- Performance tracking

### Sports & Gaming
- March Madness brackets
- Fantasy sports leagues
- Esports tournaments
- Local sports competitions

### Educational
- Academic competitions
- Quiz tournaments
- Fundraising events
- School spirit competitions

## 🛠 Technical Architecture

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Key Components
- `BracketView.tsx` - Tournament bracket visualization
- `AgentDashboard.tsx` - Individual participant dashboard
- `LoginModal.tsx` - Authentication interface

### Deployment
- **Vercel** for hosting and CI/CD
- **GitHub Actions** for automated testing
- **Custom domain** support

## 📝 Documentation

### Update Documentation When:
- Adding new features
- Changing API interfaces
- Modifying deployment process
- Creating new components

### Documentation Files
- `README.md` - Main project overview
- `DEPLOYMENT_GUIDE.md` - Setup instructions
- Component comments - Inline documentation
- GitHub Issues - Feature discussions

## 🔍 Code Review Process

### Pull Request Checklist
- [ ] Code builds without errors
- [ ] TypeScript types are properly defined
- [ ] Responsive design works on mobile
- [ ] Accessible to screen readers
- [ ] Performance impact is minimal
- [ ] Documentation is updated

### Review Criteria
- **Functionality** - Does it work as expected?
- **Code Quality** - Is it maintainable and readable?
- **Performance** - Does it impact load times?
- **Accessibility** - Can everyone use it?
- **Mobile** - Does it work on phones?

## 🚀 Deployment

### Automatic Deployment
- Push to `main` branch triggers Vercel deployment
- Pull requests get preview deployments
- Status checks must pass before merge

### Manual Testing
```bash
# Test production build locally
npm run build
npm start

# Test on different devices
# Check browser compatibility
# Verify real-time features work
```

## 🎨 Design Principles

### User Experience
- **Simplicity** - Easy to use for all skill levels
- **Performance** - Fast loading and smooth interactions
- **Accessibility** - Works for users with disabilities
- **Mobile-first** - Optimized for phone usage

### Visual Design
- **Professional** - Suitable for corporate environments
- **Engaging** - Fun and motivating for participants
- **Scalable** - Works on any screen size
- **Branded** - Customizable for different organizations

## 📞 Getting Help

### Resources
- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - General questions and ideas
- **Documentation** - Setup and usage guides
- **Code Comments** - Inline explanations

### Community
- Be respectful and inclusive
- Help others learn and contribute
- Share ideas and feedback
- Follow code of conduct

## 📈 Impact

This project helps organizations:
- **Increase Engagement** - Gamify competitions and training
- **Track Performance** - Real-time analytics and insights
- **Build Teams** - Foster collaboration and friendly competition
- **Save Time** - Automate tournament management

Every contribution makes competitions more engaging and accessible worldwide!

## 🙏 Recognition

Contributors will be:
- Listed in project credits
- Mentioned in release notes
- Invited to project discussions
- Recognized for their specific contributions

Thank you for helping build better competition platforms! 🏆