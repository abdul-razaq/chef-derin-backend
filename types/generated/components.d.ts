import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsService extends Struct.ComponentSchema {
  collectionName: 'components_elements_services';
  info: {
    description: 'Individual service item';
    displayName: 'Service';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    link: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsStat extends Struct.ComponentSchema {
  collectionName: 'components_elements_stats';
  info: {
    description: 'Statistical information display';
    displayName: 'Stat';
  };
  attributes: {
    label: Schema.Attribute.String;
    number: Schema.Attribute.String;
    suffix: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Hero section with title, subtitle, and call-to-action';
    displayName: 'Hero Section';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    ctaLink: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/about'>;
    ctaText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Explore My Journey'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Authentic Nigerian Cuisine & Cultural Storytelling'>;
    stats: Schema.Attribute.Component<'elements.stat', true>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Chef Derin'>;
    tagline: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'From Lagos to the World'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Dr. Aderinsola Awofala'>;
  };
}

export interface SectionsNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_sections_newsletters';
  info: {
    description: 'Newsletter subscription section';
    displayName: 'Newsletter Section';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    buttonText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Subscribe'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Join my culinary journey and be the first to know about new recipes, events, and cultural stories. Subscribe to my newsletter for exclusive content and updates.'>;
    placeholderText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Enter your email address'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Newsletter'>;
    successMessage: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<"Thank you for subscribing! You'll receive our latest updates soon.">;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Stay Connected'>;
  };
}

export interface SectionsResume extends Struct.ComponentSchema {
  collectionName: 'components_sections_resumes';
  info: {
    description: 'Resume/CV section with download link';
    displayName: 'Resume Section';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    ctaText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Download Resume'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Discover my culinary journey, from traditional Nigerian roots to international recognition. Download my complete professional profile and achievements.'>;
    resumeFile: Schema.Attribute.Media<'files'>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Professional Background'>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'My Journey'>;
  };
}

export interface SectionsServices extends Struct.ComponentSchema {
  collectionName: 'components_sections_services';
  info: {
    description: 'Services section with title and service items from collection';
    displayName: 'Services Section';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'From intimate private dining experiences to large-scale cultural events, I bring the authentic flavors and rich traditions of Nigerian cuisine to every occasion.'>;
    layout: Schema.Attribute.Enumeration<['grid', 'list', 'carousel']> &
      Schema.Attribute.DefaultTo<'grid'>;
    maxServices: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    services: Schema.Attribute.Relation<'oneToMany', 'api::service.service'>;
    showFeaturedOnly: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'My Services'>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'What I Do'>;
  };
}

export interface SectionsTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonials';
  info: {
    description: 'Testimonial section with multiple testimonials';
    displayName: 'Testimonial Section';
  };
  attributes: {
    autoRotate: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    backgroundImage: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    maxTestimonials: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    rotationInterval: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<5000>;
    showRatings: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Testimonials'>;
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'What People Say'>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO meta information';
    displayName: 'SEO';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Nigerian cuisine, Chef Derin, authentic food, cultural storytelling, private dining, catering'>;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Experience authentic Nigerian cuisine with Dr. Aderinsola Awofala (Chef Derin). From Lagos to the world, discover rich cultural storytelling through food.'>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Chef Derin - Authentic Nigerian Cuisine & Cultural Storytelling'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.service': ElementsService;
      'elements.stat': ElementsStat;
      'sections.hero': SectionsHero;
      'sections.newsletter': SectionsNewsletter;
      'sections.resume': SectionsResume;
      'sections.services': SectionsServices;
      'sections.testimonial': SectionsTestimonial;
      'shared.seo': SharedSeo;
    }
  }
}
