# Open Graph Image Guide

## Overview

Open Graph (OG) images are used when your pages are shared on social media platforms like Twitter, Facebook, LinkedIn, etc. They create rich previews that make your links more engaging.

## Image Specifications

### Required Dimensions

- **Size**: 1200 x 630 pixels (1.91:1 aspect ratio)
- **Format**: PNG or JPG
- **File Size**: Keep under 1MB for faster loading
- **Recommended**: PNG with transparency support

### Current OG Images Needed

1. **`/og-image.png`** (Default/Homepage)

   - Main branding image
   - Include: SprintPlanner logo, tagline "Turn ideas into executable 4-week ventures"
   - Use brand colors

2. **`/og-home.png`** (Homepage specific)

   - Can be same as og-image.png or more homepage-focused

3. **`/og-about.png`** (About page)

   - Focus: "About SprintPlanner - Built for builders and investors"
   - Include key messaging about the mission

4. **`/og-contact.png`** (Contact page)

   - Focus: "Contact SprintPlanner - Get in touch"
   - Professional, approachable design

5. **`/og-investors.png`** (Investors page)

   - Focus: "For Investors - Run 4-week idea sprints"
   - Professional, investor-focused design

6. **`/og-ideas.png`** (Ideas/Start page)
   - Focus: "Start Your Venture Sprint"
   - Action-oriented, inspiring design

## Design Tips

1. **Text Readability**: Use large, bold fonts (minimum 60px for headlines)
2. **Brand Consistency**: Use your brand colors and fonts
3. **Visual Hierarchy**: Most important info should be prominent
4. **Safe Zone**: Keep important content within 1200x630px (avoid edges)
5. **Contrast**: Ensure text is readable on the background

## Tools to Create OG Images

- **Canva**: https://canva.com (has OG image templates)
- **Figma**: Design tool with OG image templates
- **Online OG Image Generators**:
  - https://www.opengraph.xyz/
  - https://og-image.vercel.app/

## Testing Your OG Images

1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **Open Graph Preview**: https://www.opengraph.xyz/

## Implementation

All OG images are automatically configured in the SEO metadata. Just add the image files to the `/public` folder and they'll be used automatically.

## Fallback

If an OG image is not found, the system will fall back to `/logo.svg`, but it's recommended to create proper OG images for best social media previews.
