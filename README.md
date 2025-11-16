This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification. Commit messages must follow this format:

```
<type>: <subject>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

✅ Valid commit messages:
- `feat: add user authentication`
- `fix: resolve login button styling issue`
- `docs: update README with setup instructions`
- `refactor: improve error handling in API routes`

❌ Invalid commit messages:
- `Added new feature` (missing type)
- `fix bug` (missing colon)
- `FEAT: new feature` (type must be lowercase)

### Validation

Commit messages are automatically validated using:
- **Husky**: Pre-commit hook validates commit messages locally
- **GitHub Actions**: CI workflow validates commit messages in pull requests

## CI/CD

This project uses GitHub Actions for continuous integration. The CI workflow runs on every push and pull request to `main` and `dev` branches.

### CI Workflow

The CI pipeline includes:
1. **Lint**: Runs ESLint to check code quality
2. **Build**: Builds the Next.js application to ensure it compiles successfully
3. **Commitlint**: Validates commit messages in pull requests

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
