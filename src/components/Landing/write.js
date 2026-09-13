const fs=require('fs');const c=fs.readFileSync('src/components/Landing/landing_source.txt','utf8');fs.writeFileSync('src/components/Landing/LandingPage.jsx',c,'utf8');console.log('done');
