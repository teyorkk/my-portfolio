# Moises Theo - Personal Portfolio

A modern, responsive, and accessible personal portfolio website built with Next.js 14, Tailwind CSS, and Framer Motion.

## 🚀 Features

-   **Modern Tech Stack**: Built with Next.js 14, React, TypeScript, and Tailwind CSS.
-   **Responsive Design**: Fully responsive layout that looks great on all devices, from mobile to desktop.
-   **Animations**: Smooth page transitions and scroll animations powered by `framer-motion`.
-   **Dark/Light Mode**: Integrated theme toggle with system preference detection (`next-themes`).
-   **Active Navigation**: Sticky navbar with active section highlighting and smooth scrolling.
-   **Email Integration**: Functional contact form powered by EmailJS with rate limiting and spam protection.
-   **Custom UI**: Premium custom components including animated tooltips, modals, and buttons.
-   **SEO Optimized**: Semantic HTML and optimized images (`next/image`).

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
-   **Email Service**: [EmailJS](https://www.emailjs.com/)
-   **Deployment**: Vercel (Recommended)

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/my-portfolio.git
    cd my-portfolio
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env.local` file in the root directory and add your EmailJS credentials:

    ```env
    NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

-   `app/`: App router pages and global styles.
-   `app/data/`: JSON files for static data (Skills, Projects, Certifications).
-   `components/layout/`: Global layout components (Navbar, Footer).
-   `components/sections/`: Individual page sections (Hero, About, etc.).
-   `components/ui/`: Reusable UI components (Button, Card, Tooltip, etc.).
-   `lib/`: Utility functions.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
