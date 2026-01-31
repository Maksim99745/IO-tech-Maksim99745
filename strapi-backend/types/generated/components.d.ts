import type { Schema, Struct } from "@strapi/strapi";

export interface SubsectionSubsection extends Struct.ComponentSchema {
  collectionName: "components_subsection";
  info: {
    description: "";
    displayName: "Subsection";
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    items: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module "@strapi/strapi" {
  export module Public {
    export interface ComponentSchemas {
      "subsection.subsection": SubsectionSubsection;
    }
  }
}
