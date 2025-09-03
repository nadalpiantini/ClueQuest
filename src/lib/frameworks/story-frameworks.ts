// Professional narrative frameworks for interactive adventures
// Based on proven structures: Hero's Journey, Escape Room design, Corporate Learning

export interface StoryAct {
  title: string
  description: string
  duration_minutes: number
  key_elements: string[]
  player_objectives: string[]
  branching_opportunities?: string[]
}

export interface StoryFramework {
  id: string
  name: string
  description: string
  target_audience: string[]
  total_duration_range: [number, number] // min, max minutes
  acts: StoryAct[]
  success_metrics: string[]
}

// Hero's Journey Framework - Universal storytelling structure
export const HEROS_JOURNEY_FRAMEWORK: StoryFramework = {
  id: 'hero_journey',
  name: "Hero's Journey Adventure",
  description: "Classic narrative structure with call to adventure, trials, and triumphant return",
  target_audience: ['general', 'corporate', 'educational', 'family'],
  total_duration_range: [45, 120],
  acts: [
    {
      title: "Call to Adventure",
      description: "Mysterious invitation that draws players into the quest",
      duration_minutes: 8,
      key_elements: ["mysterious_message", "urgent_problem", "initial_clue"],
      player_objectives: ["Read introduction", "Form teams", "Accept the quest"],
      branching_opportunities: ["Accept immediately", "Ask questions first", "Gather more info"]
    },
    {
      title: "Meeting the Mentor", 
      description: "Guidance and tools provided for the journey ahead",
      duration_minutes: 10,
      key_elements: ["wise_guide", "special_tools", "important_warnings"],
      player_objectives: ["Learn the rules", "Get essential tools", "Understand dangers"],
      branching_opportunities: ["Follow mentor's advice", "Trust your instincts", "Seek additional help"]
    },
    {
      title: "Crossing the Threshold",
      description: "First real challenge that tests commitment and skills",
      duration_minutes: 12,
      key_elements: ["point_of_no_return", "first_test", "team_bonding"],
      player_objectives: ["Solve first puzzle", "Prove worthiness", "Commit to quest"],
      branching_opportunities: ["Cautious approach", "Bold action", "Collaborative strategy"]
    },
    {
      title: "Tests and Trials",
      description: "Series of challenges that develop skills and reveal character",
      duration_minutes: 20,
      key_elements: ["progressive_challenges", "skill_development", "team_dynamics"],
      player_objectives: ["Complete challenges", "Support teammates", "Learn from failures"],
      branching_opportunities: ["Power through", "Strategic planning", "Creative solutions"]
    },
    {
      title: "The Revelation",
      description: "Major discovery that changes everything and leads to final challenge",
      duration_minutes: 8,
      key_elements: ["shocking_truth", "paradigm_shift", "ultimate_stakes"],
      player_objectives: ["Process revelation", "Adapt strategy", "Prepare for finale"],
      branching_opportunities: ["Emotional response", "Logical analysis", "Intuitive leap"]
    },
    {
      title: "The Ordeal",
      description: "Final challenge requiring all learned skills and maximum teamwork",
      duration_minutes: 15,
      key_elements: ["ultimate_test", "all_skills_required", "high_pressure"],
      player_objectives: ["Apply all learnings", "Perfect teamwork", "Overcome final obstacle"],
      branching_opportunities: ["Different solution paths", "Role-specific contributions", "Time vs accuracy trade-offs"]
    },
    {
      title: "Return with the Elixir",
      description: "Celebration of victory and integration of lessons learned",
      duration_minutes: 7,
      key_elements: ["victory_celebration", "wisdom_sharing", "transformation_complete"],
      player_objectives: ["Celebrate success", "Share insights", "Plan future adventures"],
      branching_opportunities: ["Reflection focus", "Celebration focus", "Future planning"]
    }
  ],
  success_metrics: ["completion_rate", "engagement_score", "team_cohesion", "learning_retention", "satisfaction_rating"]
}

// Mystery Structure Framework - Optimized for detective/investigation themes
export const MYSTERY_FRAMEWORK: StoryFramework = {
  id: 'mystery_structure',
  name: 'Detective Mystery',
  description: 'Investigation-focused structure with clues, red herrings, and logical deduction',
  target_audience: ['adults', 'corporate', 'mystery_enthusiasts'],
  total_duration_range: [30, 90],
  acts: [
    {
      title: "The Crime Scene",
      description: "Discovery of the mystery and initial investigation",
      duration_minutes: 10,
      key_elements: ["incident_discovery", "initial_clues", "witness_statements"],
      player_objectives: ["Examine evidence", "Interview witnesses", "Form theories"],
      branching_opportunities: ["Focus on physical evidence", "Focus on witness testimony", "Focus on motives"]
    },
    {
      title: "Following Leads",
      description: "Investigating clues and gathering more information",
      duration_minutes: 15,
      key_elements: ["clue_investigation", "background_research", "suspect_identification"],
      player_objectives: ["Track down leads", "Research suspects", "Eliminate possibilities"],
      branching_opportunities: ["Conservative investigation", "Aggressive pursuit", "Collaborative analysis"]
    },
    {
      title: "Red Herrings & Obstacles",
      description: "False leads and complications that test deductive skills",
      duration_minutes: 12,
      key_elements: ["false_clues", "misleading_evidence", "time_pressure"],
      player_objectives: ["Identify false leads", "Stay focused", "Manage time pressure"],
      branching_opportunities: ["Trust instincts", "Double-check everything", "Seek team consensus"]
    },
    {
      title: "The Breakthrough",
      description: "Key evidence that breaks the case wide open",
      duration_minutes: 8,
      key_elements: ["crucial_evidence", "pattern_recognition", "aha_moment"],
      player_objectives: ["Connect the dots", "See the pattern", "Focus investigation"],
      branching_opportunities: ["Follow evidence logically", "Trust gut feeling", "Test hypothesis"]
    },
    {
      title: "Confronting the Truth",
      description: "Final deduction and solution presentation", 
      duration_minutes: 10,
      key_elements: ["final_deduction", "solution_presentation", "truth_revealed"],
      player_objectives: ["Present solution", "Prove guilt", "Achieve justice"],
      branching_opportunities: ["Diplomatic approach", "Direct confrontation", "Collaborative resolution"]
    }
  ],
  success_metrics: ["deduction_accuracy", "evidence_utilization", "time_efficiency", "team_communication", "mystery_solved"]
}

// Corporate Challenge Framework - Business team building focused
export const CORPORATE_FRAMEWORK: StoryFramework = {
  id: 'corporate_challenge',
  name: 'Corporate Team Challenge',
  description: 'Professional development through collaborative problem-solving',
  target_audience: ['corporate', 'professionals', 'team_building'],
  total_duration_range: [60, 180],
  acts: [
    {
      title: "The Business Challenge",
      description: "Market crisis or business problem requiring immediate team response",
      duration_minutes: 15,
      key_elements: ["business_crisis", "stakeholder_pressure", "resource_constraints"],
      player_objectives: ["Understand problem", "Assess resources", "Form strategy team"],
      branching_opportunities: ["Risk-averse approach", "Innovation-focused", "Customer-first strategy"]
    },
    {
      title: "Market Research & Analysis",
      description: "Information gathering and competitive analysis phase",
      duration_minutes: 20,
      key_elements: ["data_analysis", "competitor_research", "customer_insights"],
      player_objectives: ["Gather intelligence", "Analyze market", "Identify opportunities"],
      branching_opportunities: ["Data-driven analysis", "Intuitive insights", "Collaborative brainstorming"]
    },
    {
      title: "Strategy Development",
      description: "Collaborative solution design with cross-functional input",
      duration_minutes: 25,
      key_elements: ["strategic_planning", "resource_allocation", "risk_assessment"],
      player_objectives: ["Design solution", "Plan implementation", "Allocate resources"],
      branching_opportunities: ["Conservative strategy", "Disruptive innovation", "Partnership approach"]
    },
    {
      title: "Implementation Simulation",
      description: "Test strategy under pressure with unexpected obstacles",
      duration_minutes: 20,
      key_elements: ["execution_challenges", "unexpected_obstacles", "adaptation_required"],
      player_objectives: ["Execute plan", "Adapt to changes", "Maintain team cohesion"],
      branching_opportunities: ["Pivot strategy", "Double-down", "Seek external help"]
    },
    {
      title: "Results & Learning",
      description: "Outcome evaluation and extraction of business insights",
      duration_minutes: 15,
      key_elements: ["results_analysis", "success_factors", "improvement_areas"],
      player_objectives: ["Analyze results", "Extract learnings", "Plan improvements"],
      branching_opportunities: ["Focus on wins", "Learn from failures", "Plan next steps"]
    }
  ],
  success_metrics: ["strategic_thinking", "team_collaboration", "adaptability", "leadership_emergence", "business_acumen"]
}

// Educational Framework - Learning-focused adventures  
export const EDUCATIONAL_FRAMEWORK: StoryFramework = {
  id: 'educational_adventure',
  name: 'Learning Quest',
  description: 'Educational content delivered through engaging adventure mechanics',
  target_audience: ['students', 'educational', 'family', 'children'],
  total_duration_range: [30, 90],
  acts: [
    {
      title: "Engagement Hook",
      description: "Capture attention with intriguing problem related to learning objectives",
      duration_minutes: 8,
      key_elements: ["curiosity_spark", "relatable_problem", "clear_objectives"],
      player_objectives: ["Get curious", "Connect to prior knowledge", "Commit to learning"],
      branching_opportunities: ["Personal connection", "Peer discussion", "Independent exploration"]
    },
    {
      title: "Guided Exploration", 
      description: "Scaffolded discovery of key concepts through interactive challenges",
      duration_minutes: 18,
      key_elements: ["concept_introduction", "guided_practice", "peer_collaboration"],
      player_objectives: ["Explore concepts", "Practice skills", "Help peers"],
      branching_opportunities: ["Visual learning", "Hands-on practice", "Discussion-based"]
    },
    {
      title: "Application Challenge",
      description: "Apply learned concepts to solve increasingly complex problems",
      duration_minutes: 15,
      key_elements: ["skill_application", "problem_solving", "creative_thinking"],
      player_objectives: ["Apply knowledge", "Solve problems", "Think creatively"],
      branching_opportunities: ["Analytical approach", "Creative approach", "Collaborative approach"]
    },
    {
      title: "Knowledge Integration",
      description: "Synthesize learning and demonstrate mastery through final challenge",
      duration_minutes: 12,
      key_elements: ["knowledge_synthesis", "mastery_demonstration", "peer_teaching"],
      player_objectives: ["Demonstrate learning", "Teach others", "Make connections"],
      branching_opportunities: ["Individual mastery", "Peer teaching", "Group project"]
    },
    {
      title: "Reflection & Extension",
      description: "Reflect on learning and explore connections to real world",
      duration_minutes: 7,
      key_elements: ["learning_reflection", "real_world_connections", "future_applications"],
      player_objectives: ["Reflect on growth", "Make connections", "Plan applications"],
      branching_opportunities: ["Personal reflection", "Group discussion", "Action planning"]
    }
  ],
  success_metrics: ["concept_mastery", "engagement_level", "knowledge_retention", "peer_collaboration", "application_ability"]
}

// Get framework by ID
export function getFrameworkById(id: string): StoryFramework | null {
  const frameworks = [
    HEROS_JOURNEY_FRAMEWORK,
    MYSTERY_FRAMEWORK, 
    CORPORATE_FRAMEWORK,
    EDUCATIONAL_FRAMEWORK
  ]
  
  return frameworks.find(f => f.id === id) || null
}

// Get all available frameworks
export function getAllFrameworks(): StoryFramework[] {
  return [
    HEROS_JOURNEY_FRAMEWORK,
    MYSTERY_FRAMEWORK,
    CORPORATE_FRAMEWORK, 
    EDUCATIONAL_FRAMEWORK
  ]
}

// Generate narrative prompt using framework structure
export function generateFrameworkPrompt(
  framework: StoryFramework,
  config: {
    theme: string
    tone: string
    targetAudience: string
    duration: number
    maxPlayers: number
    specificElements?: string[]
  }
): string {
  return `Generate a complete interactive adventure narrative using the ${framework.name} structure.

FRAMEWORK STRUCTURE (${framework.acts.length} Acts):
${framework.acts.map((act, i) => `
Act ${i + 1}: ${act.title} (${act.duration_minutes}min)
- Purpose: ${act.description}
- Key Elements: ${act.key_elements.join(', ')}
- Player Objectives: ${act.player_objectives.join(', ')}
- Branching Options: ${act.branching_opportunities?.join(', ') || 'Linear progression'}
`).join('')}

ADVENTURE PARAMETERS:
- Theme: ${config.theme}
- Tone: ${config.tone}
- Target Audience: ${config.targetAudience}
- Duration: ${config.duration} minutes
- Max Players: ${config.maxPlayers}
- Special Elements: ${config.specificElements?.join(', ') || 'Standard adventure'}

REQUIREMENTS:
1. Follow the ${framework.name} structure exactly
2. Maintain ${config.tone} tone throughout
3. Appropriate for ${config.targetAudience}
4. Include meaningful choices at each branching point
5. Scale content for ${config.duration} minutes total
6. Design for teams of up to ${config.maxPlayers} players
7. Include specific objectives and success criteria for each act
8. Ensure content is engaging and age-appropriate

SUCCESS METRICS TO OPTIMIZE FOR:
${framework.success_metrics.join(', ')}

RESPONSE FORMAT:
Return as JSON with this exact structure:
{
  "framework_used": "${framework.id}",
  "total_estimated_duration": ${config.duration},
  "acts": [
    {
      "act_number": 1,
      "title": "Act title", 
      "narrative_text": "Main story content for this act",
      "player_instructions": ["What players should do"],
      "branching_choices": [
        {"text": "Choice description", "leads_to": "outcome_description"}
      ],
      "duration_minutes": ${framework.acts[0]?.duration_minutes || 10},
      "success_criteria": ["How to measure success in this act"]
    }
  ],
  "overall_theme": "${config.theme}",
  "difficulty_progression": "beginner_to_advanced",
  "team_coordination_required": true,
  "narrative_quality_score": 95
}`
}

// Corporate-specific prompt enhancements
export function enhanceForCorporateContext(basePrompt: string): string {
  return `${basePrompt}

CORPORATE CONTEXT ENHANCEMENTS:
- Use professional language and business scenarios
- Include leadership development opportunities
- Focus on collaboration and communication skills
- Incorporate decision-making under pressure
- Add elements of strategic thinking and problem-solving
- Ensure content is appropriate for workplace setting
- Include measurable learning outcomes
- Design for mixed seniority levels

BUSINESS LEARNING OBJECTIVES:
- Strategic thinking development
- Cross-functional collaboration
- Leadership skills emergence  
- Communication under pressure
- Innovation and creative problem solving
- Data-driven decision making
- Change management and adaptability

AVOID:
- Personal information requests
- Controversial topics
- Overly competitive elements that could harm relationships
- Content that could be misinterpreted as discriminatory
- Scenarios that might trigger workplace stress`
}

// Mystery-specific enhancements
export function enhanceForMysteryContext(basePrompt: string): string {
  return `${basePrompt}

MYSTERY CONTEXT ENHANCEMENTS:
- Build suspense gradually without being scary
- Include logical deduction opportunities
- Create satisfying "aha!" moments
- Balance difficulty to maintain engagement
- Provide multiple solution paths
- Include red herrings that are fair (not frustrating)
- Ensure clues are discoverable with teamwork
- Make revelation feel earned, not random

MYSTERY DESIGN PRINCIPLES:
- Every clue must be fair and logical
- Red herrings should be plausible but ultimately dismissible
- Progressive revelation of information
- Multiple investigation paths that converge
- Solutions require teamwork and communication
- Include both obvious and subtle clues
- Maintain tension without frustration

MYSTERY SUCCESS CRITERIA:
- Players can logically deduce the solution
- Clues are neither too obvious nor too obscure
- Team collaboration is required for success
- Everyone contributes meaningfully
- Solution is satisfying and makes sense in hindsight`
}

// Educational-specific enhancements
export function enhanceForEducationalContext(basePrompt: string, subject?: string): string {
  return `${basePrompt}

EDUCATIONAL CONTEXT ENHANCEMENTS:
- Align with learning objectives for ${subject || 'general knowledge'}
- Use active learning principles
- Include formative assessment opportunities
- Scaffold difficulty appropriately
- Encourage peer teaching and collaboration
- Make abstract concepts concrete through experience
- Include reflection and metacognition prompts
- Connect to real-world applications

EDUCATIONAL DESIGN PRINCIPLES:
- Multiple intelligence engagement (visual, kinesthetic, auditory, logical)
- Constructivist learning approach
- Social learning opportunities
- Immediate feedback mechanisms
- Progressive skill building
- Knowledge transfer to real situations
- Inclusive and accessible content

LEARNING OUTCOMES:
- Conceptual understanding demonstrated
- Practical skills developed
- Collaborative competencies strengthened
- Critical thinking skills enhanced
- Confidence and engagement increased`
}

// Framework selector based on parameters
export function selectOptimalFramework(
  theme: string,
  audience: string,
  duration: number,
  objectives: string[]
): StoryFramework {
  const frameworks = getAllFrameworks()
  
  // Corporate audience - prioritize Corporate Framework
  if (audience.includes('corporate') || audience.includes('professional')) {
    return CORPORATE_FRAMEWORK
  }
  
  // Mystery theme - use Mystery Framework
  if (theme.includes('mystery') || theme.includes('detective') || theme.includes('investigation')) {
    return MYSTERY_FRAMEWORK
  }
  
  // Educational context - use Educational Framework
  if (audience.includes('student') || audience.includes('educational') || objectives.some(o => o.includes('learn'))) {
    return EDUCATIONAL_FRAMEWORK
  }
  
  // Default to Hero's Journey for general audiences
  return HEROS_JOURNEY_FRAMEWORK
}

// Validate story content against framework
export function validateStoryStructure(
  story: any,
  framework: StoryFramework
): {
  valid: boolean
  score: number
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100
  
  // Check act count
  if (!story.acts || story.acts.length !== framework.acts.length) {
    issues.push(`Expected ${framework.acts.length} acts, got ${story.acts?.length || 0}`)
    score -= 20
  }
  
  // Check duration alignment
  const totalDuration = story.acts?.reduce((sum: number, act: any) => sum + (act.duration_minutes || 0), 0) || 0
  const [minDuration, maxDuration] = framework.total_duration_range
  
  if (totalDuration < minDuration || totalDuration > maxDuration) {
    issues.push(`Duration ${totalDuration}min outside optimal range ${minDuration}-${maxDuration}min`)
    score -= 10
  }
  
  // Check for required elements
  story.acts?.forEach((act: any, index: number) => {
    const frameworkAct = framework.acts[index]
    if (frameworkAct) {
      // Check if key elements are addressed
      const hasRequiredElements = frameworkAct.key_elements.some(element =>
        act.narrative_text?.toLowerCase().includes(element.replace('_', ' ')) ||
        act.player_instructions?.some((inst: string) => 
          inst.toLowerCase().includes(element.replace('_', ' '))
        )
      )
      
      if (!hasRequiredElements) {
        issues.push(`Act ${index + 1} missing key elements: ${frameworkAct.key_elements.join(', ')}`)
        score -= 5
      }
    }
  })
  
  // Generate recommendations
  if (score < 80) {
    recommendations.push('Consider following framework structure more closely')
  }
  
  if (totalDuration > maxDuration) {
    recommendations.push('Reduce content length to improve engagement')
  }
  
  if (issues.length === 0) {
    recommendations.push('Story structure follows framework well - excellent work!')
  }
  
  return {
    valid: score >= 70,
    score: Math.max(0, score),
    issues,
    recommendations
  }
}