import businessTeamImage from "@/assets/business-team-analytics.jpg";
import analyticsWorkspaceImage from "@/assets/analytics-workspace.jpg";
import businessPresentationImage from "@/assets/business-presentation.jpg";
import professionalAssessmentImage from "@/assets/professional-assessment.jpg";

const Gallery = () => {
  const images = [
    {
      src: businessTeamImage,
      alt: "Professional business team analyzing data and assessment reports",
      title: "Business Analytics Team"
    },
    {
      src: analyticsWorkspaceImage,
      alt: "Modern analytics workspace with assessment dashboards",
      title: "Professional Workspace"
    },
    {
      src: businessPresentationImage,
      alt: "Business presentation showing assessment results and insights",
      title: "Assessment Presentations"
    },
    {
      src: professionalAssessmentImage,
      alt: "Professional conducting psychological assessment evaluation",
      title: "Assessment Process"
    }
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Professional Environment</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the professional atmosphere where we conduct our assessments and consultations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {images.map((image, index) => (
            <div 
              key={index}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-elegant">
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg font-semibold">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;