"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

type PlanSection = {
  title: string;
  type: 'itinerary' | 'list' | 'tips' | 'general';
  items: PlanItem[];
};

type PlanItem = {
  title?: string;
  content: string;
  subItems?: string[];
};

;

export function PlanRenderer({ plan }: { plan: string }) {
  const [sections, setSections] = useState<PlanSection[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsedSections = parsePlan(plan);
      setSections(parsedSections);
      setError(null);
    } catch (e) {
      setError("Failed to parse travel plan. Showing raw response.");
      console.error("Parsing error:", e);
    }
  }, [plan]);

  const parsePlan = (rawPlan: string): PlanSection[] => {
    if (!rawPlan) return [];
  
    // Split by section headers (##)
    const sections = rawPlan.split(/(?=## )/g)
      .filter(section => section.trim().length > 0);
  
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].replace(/^##\s+/, '').trim();
      const content = lines.slice(1).join('\n').trim();
  
      return createSection(title, content);
    });
  };

  const createSection = (title: string, content: string): PlanSection => {
    const sectionType = getSectionType(title);
    const items = parseSectionContent(sectionType, content);

    return {
      title: title.replace(/^\d+\.\s*/, ''), // Remove numbering if present
      type: sectionType,
      items
    };
  };

  const getSectionType = (title: string): PlanSection['type'] => {
    const lowerTitle = title.toLowerCase();
    if (/itinerary|schedule|day-by-day/.test(lowerTitle)) return 'itinerary';
    if (/packing|what to bring|essentials/.test(lowerTitle)) return 'list';
    if (/budget|cost|pricing/.test(lowerTitle)) return 'tips';
    return 'general';
  };

  const parseSectionContent = (type: PlanSection['type'], content: string): PlanItem[] => {
    switch (type) {
      case 'itinerary':
        return parseItinerary(content);
      case 'list':
        return parseList(content);
      case 'tips':
        return parseTips(content);
      default:
        return [{ content }];
    }
  };

  const parseItinerary = (content: string): PlanItem[] => {
    const days = content.split(/(?=Day \d+:)/i)
      .filter(day => day.trim().length > 0);
  
    return days.map(day => {
      const lines = day.trim().split('\n');
      const dayTitle = lines[0].trim();
      const activities = lines.slice(1)
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[-*•]\s*/, '').trim());
  
      return {
        title: dayTitle,
        content: activities.join('\n'),
        subItems: activities
      };
    });
  };

  const parseList = (content: string): PlanItem[] => [{
    content,
    subItems: content.split('\n')
      .filter(l => l.trim().length > 0)
      .map(l => l.replace(/^[-*•]\s*/g, '').trim())
  }];

  const parseTips = (content: string): PlanItem[] => [{
    content,
    subItems: content.split('\n')
      .filter(l => l.trim().length > 0)
      .map(l => l.replace(/^[-*•]\s*/g, '').trim())
  }];

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-red-600">
            <div className="mb-2 font-semibold">{error}</div>
            <div className="prose whitespace-pre-wrap">{plan}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sections.length) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-blue-600">
          No travel plan could be generated. Please try adjusting your answers.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={sectionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.1 }}
        >
          <Card className="h-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow border">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {section.title}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {section.type === 'itinerary' && (
                <Accordion type="single" collapsible>
                  {section.items.map((item, itemIndex) => (
                    <AccordionItem key={itemIndex} value={`item-${sectionIndex}-${itemIndex}`}>
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                            {itemIndex + 1}
                          </Badge>
                          <span className="text-left font-medium">
                            {item.title?.replace(/^Day \d+:\s*/i, '')}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-14">
                        <div className="space-y-2">
                          {item.subItems?.map((subItem, subIndex) => (
                            <div key={subIndex} className="flex gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-300 mt-2 flex-shrink-0" />
                              <p className="text-gray-600">{subItem}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              {section.type === 'list' && (
                <div className="grid grid-cols-2 gap-3">
                  {section.items[0]?.subItems?.map((item, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="px-3 py-1.5 rounded-full bg-blue-50 border-blue-100 text-blue-600 text-sm"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              )}

              {section.type === 'tips' && (
                <div className="space-y-4">
                  {section.items[0]?.subItems?.map((tip, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink0">
                        ✓
                      </div>
                      <p className="text-gray-600">{tip}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'general' && (
                <div className="space-y-2 text-gray-600">
                  {section.items.map((item, index) => (
                    <p key={index} className="leading-relaxed">
                      {item.content}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export function PlanSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="h-full bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-3 border-b">
            <Skeleton className="h-6 w-3/4 rounded-full bg-gray-200" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-full rounded-lg bg-gray-200" />
            <Skeleton className="h-4 w-5/6 rounded-lg bg-gray-200" />
            <Skeleton className="h-4 w-4/6 rounded-lg bg-gray-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}