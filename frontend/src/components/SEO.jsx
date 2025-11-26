import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, type = 'website' }) => {
  const siteName = "Taskify";
  const defaultDescription = "The all-in-one workspace for modern organizations. Manage tasks, departments, and communications efficiently.";
  const defaultKeywords = "task management, saas, collaboration, team chat, project management";

  // Combine page title with site name (e.g., "Chat | Taskify")
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook / Slack Preview */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content="https://res.cloudinary.com/dmindwanm/image/upload/v1764148649/2_fphvpg.png" />
      {/* Add an image URL here if you have a social preview card */}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default SEO;