import step1 from '../assets/step1.png';
import step2 from '../assets/step2.png';
import step3 from '../assets/step3.png';
import step4 from '../assets/step4.png';
import step5 from '../assets/step5.png';

export const steps = [
  {
    title: 'Go to your Dashboard',
    desc: 'Access all your tools and overview from your main dashboard after logging in.',
    img: step1,
    arrow: null, // add custom SVG or overlay if needed
  },
  {
    title: 'View & Use Public Code',
    desc: 'Browse available public snippets and instantly use them via the command line.',
    img: step2,
    arrow: null,
  },
  {
    title: 'Sign Up to Save Your Own Code',
    desc: 'Click on ‘Sign Up’ to create an account and start managing your own snippets.',
    img: step3,
    arrow: null,
  },
  {
    title: 'Upload or Paste Your Code',
    desc: 'Choose to upload your code file directly or copy-paste it in our editor.',
    img: step4,
    arrow: null,
  },
  {
    title: 'Manage & Reuse Effortlessly',
    desc: 'Organize, share, and reuse your code anytime—right from your dashboard or terminal.',
    img: step5,
    arrow: null,
  },
];
