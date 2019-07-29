// Development Environment
const dev                   =   (process.env.NODE_ENV || 'development') === 'development';

// JQuery Script
const jQueryDev             =   "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.js";
const jQueryProd            =   "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
const jQueryRedirect        =   "javascripts/jquery.redirect.js";

// Normalise Stylesheet
const normaliseDev          =   "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css";
const normaliseProd         =   "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css";

// Stylesheets
const indexStyle            =   "stylesheets/index.css";
const style                 =   "stylesheets/style.css";
const profileStyle          =   "stylesheets/profile.css";
const fontStyle             =   "stylesheets/font.css";
const dashboardStyle        =   "stylesheets/dashboard.css";
const dashboard2Style        =   "stylesheets/dashboard2.css";

// Javascripts
const script                =   "javascripts/script.js";
const indexScript           =   "javascripts/index.js";
const profileScript         =   "javascripts/profile.js";
const redirectScript        =   "javascripts/redirect.js";
const dashboardScript       =   "javascripts/dashboard.js";
const dashboard2Script       =   "javascripts/dashboard2.js";

// General Metadata
const charset               =   "UTF-8";
const title                 =   "#";
const description           =   "#";
const year                  =   new Date().getFullYear();

// Twitter Metadata
const twitterCard           =   "#";
const twitterSite           =   "#";
const twitterTitle          =   "#";
const twitterDescription    =   "#";
const twitterCreator        =   "#";
const twitterImg            =   "#";

// Opengraph Metadata
const ogTitle               =   "#";
const ogURL                 =   "#";
const ogImg                 =   "#";
const ogDescription         =   "#";
const ogSite                =   "#";
const ogAdmins              =   "#";

// React

// Asset Paths


// Static File Object
var scripts = {

    jQuery              :   dev     ?   jQueryDev           :   jQueryProd,
    jQueryRedirect      :   jQueryRedirect,
    index               :   indexScript,
    profile             :   profileScript,
    redirect            :   redirectScript,
    dashboard           :   dashboardScript,
    dashboard2          :   dashboard2Script,
    script              :   script
    
} 

// Stylesheet File Object
var stylesheets = {

    normalise           :   dev     ?   normaliseDev        :   normaliseProd,
    index               :   indexStyle,
    profile             :   profileStyle,
    style               :   style,
    dashboard           :   dashboardStyle,
    dashboard2          :   dashboard2Style,
    font                :   fontStyle

}

// Metadata Object
var metadata = {

    title               :   title,
    description         :   description,
    charset             :   charset,
    year                :   year,

    twitterCard         :   twitterCard,
    twitterSite         :   twitterSite,
    twitterTitle        :   twitterTitle,
    twitterDescription  :   twitterDescription,
    twitterCreator      :   twitterCreator,
    twitterImg          :   twitterImg,

    ogTitle             :   ogTitle,
    ogURL               :   ogURL,
    ogImg               :   ogImg,
    ogDescription       :   ogDescription,
    ogSite              :   ogSite,
    ogAdmins            :   ogAdmins

}

module.exports = {
    
    metadata            :   metadata,
    scripts             :   scripts,
    stylesheets         :   stylesheets

};