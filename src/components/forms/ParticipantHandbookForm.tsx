import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { SignaturePad } from '@/components/ui/signature-pad';
import { useScrollToTop, scrollToTop } from '@/hooks/useScrollToTop';

// Comprehensive schema for all 17 handbook forms
const handbookSchema = z.object({
  // Common participant info
  participantName: z.string().trim().min(1, 'Participant name is required').max(100),
  participantDob: z.string().min(1, 'Date of birth is required'),
  
  // Step 1: Consent to Participate
  consentDate: z.string().optional(),
  consentStaffName: z.string().optional(),
  consentQuestionsAnswered: z.enum(['Yes', 'No']).optional(),
  consentAgreeToParticipate: z.enum(['I DO', 'I DO NOT']).optional(),
  consentParticipantSignature: z.string().optional(),
  consentParticipantSignatureDate: z.string().optional(),
  consentStaffSignature: z.string().optional(),
  consentStaffSignatureDate: z.string().optional(),
  consentSupervisorSignature: z.string().optional(),
  consentSupervisorSignatureDate: z.string().optional(),
  
  // Step 2: Privacy Practices
  privacyProgram: z.string().optional(),
  privacySignature: z.string().optional(),
  privacySignatureDate: z.string().optional(),
  privacyPrintName: z.string().optional(),
  privacyPersonalRepTitle: z.string().optional(),
  privacyProgramStaffSignature: z.string().optional(),
  privacyProgramStaffDate: z.string().optional(),
  privacyProgramStaffNameTitle: z.string().optional(),
  
  // Step 3: Recording Authorization
  recordingFullName: z.string().optional(),
  recordingStreetAddress: z.string().optional(),
  recordingCity: z.string().optional(),
  recordingState: z.string().optional(),
  recordingZipCode: z.string().optional(),
  recordingPhone: z.string().optional(),
  recordingFax: z.string().optional(),
  recordingEmail: z.string().optional(),
  recordingSignature: z.string().optional(),
  recordingSignatureDate: z.string().optional(),
  recordingParentSignature: z.string().optional(),
  recordingParentSignatureDate: z.string().optional(),
  
  // Step 4: COVID-19 Screening
  covidStaffParticipantVisitor: z.string().optional(),
  covidDateWeekBeginning: z.string().optional(),
  covidInitialTestResult: z.string().optional(),
  covidInitialTestInitials: z.string().optional(),
  covidParticipantSignature: z.string().optional(),
  covidParticipantSignatureDate: z.string().optional(),
  
  // Step 5: Rights Acknowledgment
  rightsSignature: z.string().optional(),
  rightsSignatureDate: z.string().optional(),
  
  // Step 6: Tobacco Cessation
  tobaccoCurrentlySmoke: z.string().optional(),
  tobaccoProductsUsed: z.string().optional(),
  tobaccoYearsSmoking: z.string().optional(),
  tobaccoCigarettesPerDay: z.string().optional(),
  tobaccoPreviousQuitAttempts: z.string().optional(),
  tobaccoHealthIssues: z.string().optional(),
  tobaccoUnderstandRisks: z.string().optional(),
  tobaccoReadyToQuit: z.string().optional(),
  tobaccoQuitDate: z.string().optional(),
  tobaccoSupportSystem: z.string().optional(),
  tobaccoSignature: z.string().optional(),
  tobaccoSignatureDate: z.string().optional(),
  
  // Step 7: Suicide Risk Screening
  suicideQ1WishedDead: z.string().optional(),
  suicideQ2FamilyBetterOff: z.string().optional(),
  suicideQ3ThoughtsKillingSelf: z.string().optional(),
  suicideQ4EverTriedKillSelf: z.string().optional(),
  suicideQ4How: z.string().optional(),
  suicideQ4When: z.string().optional(),
  suicideQ5ThoughtsKillingNow: z.string().optional(),
  suicideQ5Describe: z.string().optional(),
  suicideScreeningResult: z.string().optional(),
  suicideSignature: z.string().optional(),
  suicideSignatureDate: z.string().optional(),
  
  // Step 8: Homicide Risk Assessment
  homicideThoughtsHarmingOthers: z.string().optional(),
  homicideTimeThinkingHarm: z.string().optional(),
  homicideWho: z.string().optional(),
  homicideWhenHarm: z.string().optional(),
  homicideWhereHarm: z.string().optional(),
  homicidePlanToHarm: z.string().optional(),
  homicideAccessMeans: z.string().optional(),
  homicideHistoryViolence: z.string().optional(),
  homicideEnvironmentalRiskFactors: z.array(z.string()).optional(),
  homicideProtectiveFactors: z.array(z.string()).optional(),
  homicideAssessmentRisk: z.string().optional(),
  homicideResourceGuideProvided: z.string().optional(),
  homicideSignature: z.string().optional(),
  homicideSignatureDate: z.string().optional(),
  
  // Step 9: Staff Use Only Risk Assessment
  staffRiskLevel: z.string().optional(),
  staffRiskProtectiveFactors: z.string().optional(),
  staffSuicidalityHomicidality: z.string().optional(),
  staffPossibleInterventions: z.string().optional(),
  staffLowRiskActions: z.array(z.string()).optional(),
  staffModerateHighRiskActions: z.array(z.string()).optional(),
  staffAdditionalComments: z.string().optional(),
  staffRiskStaffSignature: z.string().optional(),
  staffRiskStaffSignatureDate: z.string().optional(),
  
  // Step 10: Overdose Risk Screening
  overdoseCurrentHeroinUser: z.number().optional(),
  overdoseCurrentInjector: z.number().optional(),
  overdoseStartedInjectingSixMonths: z.number().optional(),
  overdoseCurrentMethadonePrescribed: z.number().optional(),
  overdoseCurrentMethadoneStreet: z.number().optional(),
  overdoseNotSupervisedConsumption: z.number().optional(),
  overdoseAlsoDrinksAlcohol: z.number().optional(),
  overdoseUsesBenzodiazepines: z.number().optional(),
  overdoseDualUseHeroinCrack: z.number().optional(),
  overdosePrisonHospitalTreatmentMonth: z.number().optional(),
  overdoseEverOverdosed: z.number().optional(),
  overdoseOverdosedOncePastYear: z.number().optional(),
  overdoseOverdosedTwicePastYear: z.number().optional(),
  overdoseUsingMoreFiveYears: z.number().optional(),
  overdoseUsingLargeAmounts: z.number().optional(),
  overdoseHarderGetBuzz: z.number().optional(),
  overdoseEnjoysBigGouch: z.number().optional(),
  overdoseProneLowMood: z.number().optional(),
  overdoseTendsUseAlone: z.number().optional(),
  overdoseHasHealthProblems: z.number().optional(),
  overdoseErraticPatternsUse: z.number().optional(),
  overdoseTotalScore: z.number().optional(),
  overdoseRiskLevel: z.string().optional(),
  overdoseStaffSignature: z.string().optional(),
  overdoseStaffCredentials: z.string().optional(),
  overdoseSignature: z.string().optional(),
  overdoseSignatureDate: z.string().optional(),
  
  // Step 11: MAUD/MOUD Education (expanded)
  maudEducationProvidedIntake: z.boolean().optional(),
  maudEducationProvidedIntakeParticipantInitials: z.string().optional(),
  maudEducationProvidedIntakeStaffInitials: z.string().optional(),
  maudThoroughEducationBenefitsRisks: z.boolean().optional(),
  maudThoroughEducationBenefitsRisksParticipantInitials: z.string().optional(),
  maudThoroughEducationBenefitsRisksStaffInitials: z.string().optional(),
  maudEducatedOverdoseRisks: z.boolean().optional(),
  maudEducatedOverdoseRisksParticipantInitials: z.string().optional(),
  maudEducatedOverdoseRisksStaffInitials: z.string().optional(),
  maudEducatedNaloxoneOverview: z.boolean().optional(),
  maudEducatedNaloxoneOverviewParticipantInitials: z.string().optional(),
  maudEducatedNaloxoneOverviewStaffInitials: z.string().optional(),
  maudEducatedPrescriptionPharmacies: z.boolean().optional(),
  maudEducatedPrescriptionPharmaciesParticipantInitials: z.string().optional(),
  maudEducatedPrescriptionPharmaciesStaffInitials: z.string().optional(),
  maudEducatedInstructionsPirFamily: z.boolean().optional(),
  maudEducatedInstructionsPirFamilyParticipantInitials: z.string().optional(),
  maudEducatedInstructionsPirFamilyStaffInitials: z.string().optional(),
  maudEducatedNaloxoneProvided: z.boolean().optional(),
  maudEducatedNaloxoneProvidedParticipantInitials: z.string().optional(),
  maudEducatedNaloxoneProvidedStaffInitials: z.string().optional(),
  maudEducatedPharmaciesStockNaloxone: z.boolean().optional(),
  maudEducatedPharmaciesStockNaloxoneParticipantInitials: z.string().optional(),
  maudEducatedPharmaciesStockNaloxoneStaffInitials: z.string().optional(),
  maudEducatedRelapseRisk: z.boolean().optional(),
  maudEducatedRelapseRiskParticipantInitials: z.string().optional(),
  maudEducatedRelapseRiskStaffInitials: z.string().optional(),
  maudEducatedRelapsePrevention: z.boolean().optional(),
  maudEducatedRelapsePreventionParticipantInitials: z.string().optional(),
  maudEducatedRelapsePreventionStaffInitials: z.string().optional(),
  maudEducatedCommunityCareWebsite: z.boolean().optional(),
  maudEducatedCommunityCareWebsiteParticipantInitials: z.string().optional(),
  maudEducatedCommunityCareWebsiteStaffInitials: z.string().optional(),
  maudEducatedTriggersCravings: z.boolean().optional(),
  maudEducatedTriggersCravingsParticipantInitials: z.string().optional(),
  maudEducatedTriggersCravingsStaffInitials: z.string().optional(),
  maudEducatedRightsFreedomChoice: z.boolean().optional(),
  maudEducatedRightsFreedomChoiceParticipantInitials: z.string().optional(),
  maudEducatedRightsFreedomChoiceStaffInitials: z.string().optional(),
  maudEducatedMedicationAccessInstructions: z.boolean().optional(),
  maudEducatedMedicationAccessInstructionsParticipantInitials: z.string().optional(),
  maudEducatedMedicationAccessInstructionsStaffInitials: z.string().optional(),
  maudParticipantSignature: z.string().optional(),
  maudParticipantSignatureDate: z.string().optional(),
  maudStaffSignature: z.string().optional(),
  maudStaffSignatureDate: z.string().optional(),
  
  // Step 12: SNAP Assessment
  snapStrengths: z.record(z.boolean()).optional(),
  snapStrengthsOther: z.string().optional(),
  snapNeeds: z.record(z.boolean()).optional(),
  snapNeedsOther: z.string().optional(),
  snapAbilities: z.record(z.boolean()).optional(),
  snapAbilitiesEducationTraining: z.string().optional(),
  snapAbilitiesLeisureSkills: z.string().optional(),
  snapAbilitiesOther: z.string().optional(),
  snapPreferences: z.record(z.boolean()).optional(),
  snapPreferencesLiveOther: z.string().optional(),
  snapPreferencesInterestOther: z.string().optional(),
  snapParticipantSignature: z.string().optional(),
  snapParticipantSignatureDate: z.string().optional(),
  snapStaffSignature: z.string().optional(),
  snapStaffTitle: z.string().optional(),
  snapStaffSignatureDate: z.string().optional(),
  
  // Step 13: SNAP Outcomes Preliminary ISP
  snapOutcomesDateOfAdmission: z.string().optional(),
  snapOutcomesDateCompleted: z.string().optional(),
  snapOutcomesDateIspDue: z.string().optional(),
  snapOutcomesHasWrapPlan: z.string().optional(),
  snapOutcomesWantsWrapPlan: z.string().optional(),
  snapOutcomesDomainLiving: z.string().optional(),
  snapOutcomesDomainEducation: z.string().optional(),
  snapOutcomesDomainHealth: z.string().optional(),
  snapOutcomesDomainSocializing: z.string().optional(),
  snapOutcomesGoals: z.record(z.boolean()).optional(),
  snapOutcomesGoalIdentifyFamily: z.string().optional(),
  snapOutcomesAdditionalGoals: z.string().optional(),
  snapOutcomesParticipantSignature: z.string().optional(),
  snapOutcomesParticipantSignatureDate: z.string().optional(),
  
  // Step 14: Camberwell Assessment Outcomes
  camberwellOutcomesDateOfAdmission: z.string().optional(),
  camberwellOutcomesDateCompleted: z.string().optional(),
  camberwellOutcomesDateIspDue: z.string().optional(),
  camberwellOutcomesHasWrapPlan: z.string().optional(),
  camberwellOutcomesWantsWrapPlan: z.string().optional(),
  camberwellOutcomesConcerns: z.string().optional(),
  camberwellOutcomesMonthData: z.record(z.any()).optional(),
  camberwellOutcomesGoals: z.record(z.boolean()).optional(),
  camberwellOutcomesGoalIdentifyFamily: z.string().optional(),
  camberwellOutcomesAdditionalGoals: z.string().optional(),
  camberwellOutcomesParticipantSignature: z.string().optional(),
  camberwellOutcomesParticipantSignatureDate: z.string().optional(),
  
  // Step 15: Camberwell Assessment of Need (CAN)
  canAssessmentNumber: z.string().optional(),
  canInterviewed: z.string().optional(),
  canDateOfAssessment: z.string().optional(),
  canAssessorInitials: z.string().optional(),
  canData: z.record(z.any()).optional(),
  canTotalMetNeeds: z.number().optional(),
  canTotalUnmetNeeds: z.number().optional(),
  canTotalNumberNeeds: z.number().optional(),
  
  // Step 16: Preliminary ISP Form
  preliminaryIspActions: z.record(z.boolean()).optional(),
  preliminaryIspActionMeetCpsCrsName: z.string().optional(),
  preliminaryIspActionMeetCpsCrsTimes: z.number().optional(),
  preliminaryIspAdditionalActions: z.string().optional(),
  preliminaryIspParticipantSignature: z.string().optional(),
  preliminaryIspParticipantSignatureDate: z.string().optional(),
  preliminaryIspCpsCrsSignature: z.string().optional(),
  preliminaryIspCpsCrsSignatureDate: z.string().optional(),
  preliminaryIspCpsCrsSupervisorSignature: z.string().optional(),
  preliminaryIspCpsCrsSupervisorSignatureDate: z.string().optional(),
  
  // Step 17: Orientation Confirmation
  orientationPolicies: z.record(z.any()).optional(),
  orientationParticipantSignature: z.string().optional(),
  orientationParticipantSignatureDate: z.string().optional(),
  orientationStaffSignature: z.string().optional(),
  orientationStaffSignatureDate: z.string().optional(),
});

type FormValues = z.infer<typeof handbookSchema>;

export const ParticipantHandbookForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 17;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(handbookSchema),
    defaultValues: {
      participantName: '',
      participantDob: '',
      homicideEnvironmentalRiskFactors: [],
      homicideProtectiveFactors: [],
      staffLowRiskActions: [],
      staffModerateHighRiskActions: [],
    },
  });

  // Scroll to top on mount and when step changes
  useScrollToTop([currentStep]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Handbook form submitted with data:', data);
      
      const submissionData = {
        participantName: data.participantName,
        participantDob: data.participantDob,
        consentToParticipate: data.consentDate ? {
          date: data.consentDate,
          participantName: data.participantName,
          staffName: data.consentStaffName,
          questionsAnswered: data.consentQuestionsAnswered,
          agreeToParticipate: data.consentAgreeToParticipate,
          participantSignature: data.consentParticipantSignature,
          participantSignatureDate: data.consentParticipantSignatureDate,
          staffSignature: data.consentStaffSignature,
          staffSignatureDate: data.consentStaffSignatureDate,
          supervisorSignature: data.consentSupervisorSignature,
          supervisorSignatureDate: data.consentSupervisorSignatureDate,
        } : null,
        privacyPractices: data.privacyProgram ? {
          participantName: data.participantName,
          program: data.privacyProgram,
          signature: data.privacySignature,
          signatureDate: data.privacySignatureDate,
          printName: data.privacyPrintName,
          personalRepresentativeTitle: data.privacyPersonalRepTitle,
          programStaffSignature: data.privacyProgramStaffSignature,
          programStaffDate: data.privacyProgramStaffDate,
          programStaffNameTitle: data.privacyProgramStaffNameTitle,
        } : null,
        recordingAuthorization: data.recordingFullName ? {
          fullName: data.recordingFullName,
          streetAddress: data.recordingStreetAddress,
          city: data.recordingCity,
          state: data.recordingState,
          zipCode: data.recordingZipCode,
          phone: data.recordingPhone,
          fax: data.recordingFax,
          email: data.recordingEmail,
          signature: data.recordingSignature,
          signatureDate: data.recordingSignatureDate,
          parentSignature: data.recordingParentSignature,
          parentSignatureDate: data.recordingParentSignatureDate,
        } : null,
        covid19Screening: data.covidStaffParticipantVisitor ? {
          participantName: data.participantName,
          staffParticipantVisitor: data.covidStaffParticipantVisitor,
          dateWeekBeginning: data.covidDateWeekBeginning,
          initialCovidTestResult: data.covidInitialTestResult,
          initialCovidTestInitials: data.covidInitialTestInitials,
          responses: {},
          participantSignature: data.covidParticipantSignature,
          participantSignatureDate: data.covidParticipantSignatureDate,
        } : null,
        rightsAcknowledgment: data.rightsSignature ? {
          participantSignature: data.rightsSignature,
          signatureDate: data.rightsSignatureDate,
        } : null,
        tobaccoCessation: data.tobaccoCurrentlySmoke ? {
          patientName: data.participantName,
          dateOfBirth: data.participantDob,
          currentlySmokeTobacco: data.tobaccoCurrentlySmoke,
          tobaccoProductsUsed: data.tobaccoProductsUsed,
          yearsSmoking: data.tobaccoYearsSmoking,
          cigarettesPerDay: data.tobaccoCigarettesPerDay,
          previousQuitAttempts: data.tobaccoPreviousQuitAttempts,
          healthIssues: data.tobaccoHealthIssues,
          understandHealthRisks: data.tobaccoUnderstandRisks,
          readyToQuit: data.tobaccoReadyToQuit,
          quitDate: data.tobaccoQuitDate,
          supportSystem: data.tobaccoSupportSystem,
          signature: data.tobaccoSignature,
          signatureDate: data.tobaccoSignatureDate,
        } : null,
        suicideRiskScreening: data.suicideQ1WishedDead ? {
          participantName: data.participantName,
          dateOfBirth: data.participantDob,
          q1WishedDead: data.suicideQ1WishedDead,
          q2FamilyBetterOff: data.suicideQ2FamilyBetterOff,
          q3ThoughtsKillingSelf: data.suicideQ3ThoughtsKillingSelf,
          q4EverTriedKillSelf: data.suicideQ4EverTriedKillSelf,
          q4How: data.suicideQ4How,
          q4When: data.suicideQ4When,
          q5ThoughtsKillingNow: data.suicideQ5ThoughtsKillingNow,
          q5Describe: data.suicideQ5Describe,
          screeningResult: data.suicideScreeningResult,
          participantSignature: data.suicideSignature,
          signatureDate: data.suicideSignatureDate,
        } : null,
        homicideRiskAssessment: data.homicideThoughtsHarmingOthers ? {
          participantName: data.participantName,
          dateOfBirth: data.participantDob,
          thoughtsHarmingOthers: data.homicideThoughtsHarmingOthers,
          timeThinkingHarm: data.homicideTimeThinkingHarm,
          who: data.homicideWho,
          whenHarm: data.homicideWhenHarm,
          whereHarm: data.homicideWhereHarm,
          planToHarm: data.homicidePlanToHarm,
          accessMeans: data.homicideAccessMeans,
          historyViolence: data.homicideHistoryViolence,
          environmentalRiskFactors: data.homicideEnvironmentalRiskFactors || [],
          protectiveFactors: data.homicideProtectiveFactors || [],
          assessmentRisk: data.homicideAssessmentRisk,
          resourceGuideProvided: data.homicideResourceGuideProvided,
          participantSignature: data.homicideSignature,
          signatureDate: data.homicideSignatureDate,
        } : null,
        staffRiskAssessment: data.staffRiskLevel ? {
          participantName: data.participantName,
          dateOfBirth: data.participantDob,
          riskLevel: data.staffRiskLevel,
          riskProtectiveFactors: data.staffRiskProtectiveFactors,
          suicidalityHomicidality: data.staffSuicidalityHomicidality,
          possibleInterventions: data.staffPossibleInterventions,
          lowRiskActions: data.staffLowRiskActions || [],
          moderateHighRiskActions: data.staffModerateHighRiskActions || [],
          additionalComments: data.staffAdditionalComments,
          staffSignature: data.staffRiskStaffSignature,
          staffSignatureDate: data.staffRiskStaffSignatureDate,
        } : null,
        overdoseRiskScreening: data.overdoseCurrentHeroinUser !== undefined ? {
          participantName: data.participantName,
          dateOfBirth: data.participantDob,
          currentHeroinUser: data.overdoseCurrentHeroinUser,
          currentInjector: data.overdoseCurrentInjector,
          startedInjectingSixMonths: data.overdoseStartedInjectingSixMonths,
          currentMethadonePrescribed: data.overdoseCurrentMethadonePrescribed,
          currentMethadoneStreet: data.overdoseCurrentMethadoneStreet,
          notSupervisedConsumption: data.overdoseNotSupervisedConsumption,
          alsoDrinksAlcohol: data.overdoseAlsoDrinksAlcohol,
          usesBenzodiazepines: data.overdoseUsesBenzodiazepines,
          dualUseHeroinCrack: data.overdoseDualUseHeroinCrack,
          prisonHospitalTreatmentMonth: data.overdosePrisonHospitalTreatmentMonth,
          everOverdosed: data.overdoseEverOverdosed,
          overdosedOncePastYear: data.overdoseOverdosedOncePastYear,
          overdosedTwicePastYear: data.overdoseOverdosedTwicePastYear,
          usingMoreFiveYears: data.overdoseUsingMoreFiveYears,
          usingLargeAmounts: data.overdoseUsingLargeAmounts,
          harderGetBuzz: data.overdoseHarderGetBuzz,
          enjoysBigGouch: data.overdoseEnjoysBigGouch,
          proneLowMood: data.overdoseProneLowMood,
          tendsUseAlone: data.overdoseTendsUseAlone,
          hasHealthProblems: data.overdoseHasHealthProblems,
          erraticPatternsUse: data.overdoseErraticPatternsUse,
          totalScore: data.overdoseTotalScore,
          riskLevel: data.overdoseRiskLevel,
          staffSignature: data.overdoseStaffSignature,
          staffCredentials: data.overdoseStaffCredentials,
          participantSignature: data.overdoseSignature,
          signatureDate: data.overdoseSignatureDate,
        } : null,
        maudMoudEducation: data.maudEducationProvidedIntake !== undefined ? {
          educationProvidedIntake: data.maudEducationProvidedIntake,
          educationProvidedIntakeParticipantInitials: data.maudEducationProvidedIntakeParticipantInitials,
          educationProvidedIntakeStaffInitials: data.maudEducationProvidedIntakeStaffInitials,
          thoroughEducationBenefitsRisks: data.maudThoroughEducationBenefitsRisks,
          thoroughEducationBenefitsRisksParticipantInitials: data.maudThoroughEducationBenefitsRisksParticipantInitials,
          thoroughEducationBenefitsRisksStaffInitials: data.maudThoroughEducationBenefitsRisksStaffInitials,
          educatedOverdoseRisks: data.maudEducatedOverdoseRisks,
          educatedOverdoseRisksParticipantInitials: data.maudEducatedOverdoseRisksParticipantInitials,
          educatedOverdoseRisksStaffInitials: data.maudEducatedOverdoseRisksStaffInitials,
          educatedNaloxoneOverview: data.maudEducatedNaloxoneOverview,
          educatedNaloxoneOverviewParticipantInitials: data.maudEducatedNaloxoneOverviewParticipantInitials,
          educatedNaloxoneOverviewStaffInitials: data.maudEducatedNaloxoneOverviewStaffInitials,
          educatedPrescriptionPharmacies: data.maudEducatedPrescriptionPharmacies,
          educatedPrescriptionPharmaciesParticipantInitials: data.maudEducatedPrescriptionPharmaciesParticipantInitials,
          educatedPrescriptionPharmaciesStaffInitials: data.maudEducatedPrescriptionPharmaciesStaffInitials,
          educatedInstructionsPirFamily: data.maudEducatedInstructionsPirFamily,
          educatedInstructionsPirFamilyParticipantInitials: data.maudEducatedInstructionsPirFamilyParticipantInitials,
          educatedInstructionsPirFamilyStaffInitials: data.maudEducatedInstructionsPirFamilyStaffInitials,
          educatedNaloxoneProvided: data.maudEducatedNaloxoneProvided,
          educatedNaloxoneProvidedParticipantInitials: data.maudEducatedNaloxoneProvidedParticipantInitials,
          educatedNaloxoneProvidedStaffInitials: data.maudEducatedNaloxoneProvidedStaffInitials,
          educatedPharmaciesStockNaloxone: data.maudEducatedPharmaciesStockNaloxone,
          educatedPharmaciesStockNaloxoneParticipantInitials: data.maudEducatedPharmaciesStockNaloxoneParticipantInitials,
          educatedPharmaciesStockNaloxoneStaffInitials: data.maudEducatedPharmaciesStockNaloxoneStaffInitials,
          educatedRelapseRisk: data.maudEducatedRelapseRisk,
          educatedRelapseRiskParticipantInitials: data.maudEducatedRelapseRiskParticipantInitials,
          educatedRelapseRiskStaffInitials: data.maudEducatedRelapseRiskStaffInitials,
          educatedRelapsePrevention: data.maudEducatedRelapsePrevention,
          educatedRelapsePreventionParticipantInitials: data.maudEducatedRelapsePreventionParticipantInitials,
          educatedRelapsePreventionStaffInitials: data.maudEducatedRelapsePreventionStaffInitials,
          educatedCommunityCareWebsite: data.maudEducatedCommunityCareWebsite,
          educatedCommunityCareWebsiteParticipantInitials: data.maudEducatedCommunityCareWebsiteParticipantInitials,
          educatedCommunityCareWebsiteStaffInitials: data.maudEducatedCommunityCareWebsiteStaffInitials,
          educatedTriggersCravings: data.maudEducatedTriggersCravings,
          educatedTriggersCravingsParticipantInitials: data.maudEducatedTriggersCravingsParticipantInitials,
          educatedTriggersCravingsStaffInitials: data.maudEducatedTriggersCravingsStaffInitials,
          educatedRightsFreedomChoice: data.maudEducatedRightsFreedomChoice,
          educatedRightsFreedomChoiceParticipantInitials: data.maudEducatedRightsFreedomChoiceParticipantInitials,
          educatedRightsFreedomChoiceStaffInitials: data.maudEducatedRightsFreedomChoiceStaffInitials,
          educatedMedicationAccessInstructions: data.maudEducatedMedicationAccessInstructions,
          educatedMedicationAccessInstructionsParticipantInitials: data.maudEducatedMedicationAccessInstructionsParticipantInitials,
          educatedMedicationAccessInstructionsStaffInitials: data.maudEducatedMedicationAccessInstructionsStaffInitials,
          participantSignature: data.maudParticipantSignature,
          participantSignatureDate: data.maudParticipantSignatureDate,
          staffSignature: data.maudStaffSignature,
          staffSignatureDate: data.maudStaffSignatureDate,
        } : null,
        snapAssessment: data.snapStrengths ? {
          participantName: data.participantName,
          strengths: data.snapStrengths,
          strengthsOther: data.snapStrengthsOther,
          needs: data.snapNeeds,
          needsOther: data.snapNeedsOther,
          abilities: data.snapAbilities,
          abilitiesEducationTraining: data.snapAbilitiesEducationTraining,
          abilitiesLeisureSkills: data.snapAbilitiesLeisureSkills,
          abilitiesOther: data.snapAbilitiesOther,
          preferences: data.snapPreferences,
          preferencesLiveOther: data.snapPreferencesLiveOther,
          preferencesInterestOther: data.snapPreferencesInterestOther,
          participantSignature: data.snapParticipantSignature,
          participantSignatureDate: data.snapParticipantSignatureDate,
          staffSignature: data.snapStaffSignature,
          staffTitle: data.snapStaffTitle,
          staffSignatureDate: data.snapStaffSignatureDate,
        } : null,
        snapOutcomesIsp: data.snapOutcomesDateOfAdmission ? {
          participantName: data.participantName,
          dateOfAdmission: data.snapOutcomesDateOfAdmission,
          dateCompleted: data.snapOutcomesDateCompleted,
          dateIspDue: data.snapOutcomesDateIspDue,
          hasWrapPlan: data.snapOutcomesHasWrapPlan,
          wantsWrapPlan: data.snapOutcomesWantsWrapPlan,
          domainLiving: data.snapOutcomesDomainLiving,
          domainEducation: data.snapOutcomesDomainEducation,
          domainHealth: data.snapOutcomesDomainHealth,
          domainSocializing: data.snapOutcomesDomainSocializing,
          goals: data.snapOutcomesGoals,
          goalIdentifyFamily: data.snapOutcomesGoalIdentifyFamily,
          additionalGoals: data.snapOutcomesAdditionalGoals,
          participantSignature: data.snapOutcomesParticipantSignature,
          participantSignatureDate: data.snapOutcomesParticipantSignatureDate,
        } : null,
        camberwellOutcomes: data.camberwellOutcomesDateOfAdmission ? {
          participantName: data.participantName,
          dateOfAdmission: data.camberwellOutcomesDateOfAdmission,
          dateCompleted: data.camberwellOutcomesDateCompleted,
          dateIspDue: data.camberwellOutcomesDateIspDue,
          hasWrapPlan: data.camberwellOutcomesHasWrapPlan,
          wantsWrapPlan: data.camberwellOutcomesWantsWrapPlan,
          concerns: data.camberwellOutcomesConcerns,
          monthData: data.camberwellOutcomesMonthData,
          goals: data.camberwellOutcomesGoals,
          goalIdentifyFamily: data.camberwellOutcomesGoalIdentifyFamily,
          additionalGoals: data.camberwellOutcomesAdditionalGoals,
          participantSignature: data.camberwellOutcomesParticipantSignature,
          participantSignatureDate: data.camberwellOutcomesParticipantSignatureDate,
        } : null,
        camberwellAssessmentNeed: data.canAssessmentNumber ? {
          participantName: data.participantName,
          assessmentNumber: data.canAssessmentNumber,
          interviewed: data.canInterviewed,
          dateOfAssessment: data.canDateOfAssessment,
          assessorInitials: data.canAssessorInitials,
          canData: data.canData,
          totalMetNeeds: data.canTotalMetNeeds,
          totalUnmetNeeds: data.canTotalUnmetNeeds,
          totalNumberNeeds: data.canTotalNumberNeeds,
        } : null,
        preliminaryIsp: data.preliminaryIspActions ? {
          actions: data.preliminaryIspActions,
          actionMeetCpsCrsName: data.preliminaryIspActionMeetCpsCrsName,
          actionMeetCpsCrsTimes: data.preliminaryIspActionMeetCpsCrsTimes,
          additionalActions: data.preliminaryIspAdditionalActions,
          participantSignature: data.preliminaryIspParticipantSignature,
          participantSignatureDate: data.preliminaryIspParticipantSignatureDate,
          cpsCrsSignature: data.preliminaryIspCpsCrsSignature,
          cpsCrsSignatureDate: data.preliminaryIspCpsCrsSignatureDate,
          cpsCrsSupervisorSignature: data.preliminaryIspCpsCrsSupervisorSignature,
          cpsCrsSupervisorSignatureDate: data.preliminaryIspCpsCrsSupervisorSignatureDate,
        } : null,
        orientationConfirmation: data.orientationPolicies ? {
          participantName: data.participantName,
          policies: data.orientationPolicies,
          participantSignature: data.orientationParticipantSignature,
          participantSignatureDate: data.orientationParticipantSignatureDate,
          staffSignature: data.orientationStaffSignature,
          staffSignatureDate: data.orientationStaffSignatureDate,
        } : null,
      };
      
      const response = await api.submitHandbook(submissionData);
      
      if (response.success) {
        toast.success('Handbook submitted successfully!', {
          description: `Your handbook forms have been saved. Reference ID: ${response.data?.submissionId || 'N/A'}`,
          duration: 3000,
        });
        
        setTimeout(() => {
          window.location.href = '/handbook';
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to submit handbook');
      }
    } catch (error: any) {
      console.error('Error submitting handbook:', error);
      const errorMessage = error?.message || error?.error || 'Please check your connection and try again.';
      toast.error('Failed to submit handbook', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ['participantName', 'participantDob'];
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      scrollToTop();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const renderProgressIndicator = () => {
    const steps = [
      { number: 1, label: 'Consent' },
      { number: 2, label: 'Privacy' },
      { number: 3, label: 'Recording' },
      { number: 4, label: 'COVID-19' },
      { number: 5, label: 'Rights' },
      { number: 6, label: 'Tobacco' },
      { number: 7, label: 'Suicide' },
      { number: 8, label: 'Homicide' },
      { number: 9, label: 'Staff Risk' },
      { number: 10, label: 'Overdose' },
      { number: 11, label: 'MAUD/MOUD' },
      { number: 12, label: 'SNAP' },
      { number: 13, label: 'SNAP ISP' },
      { number: 14, label: 'Camberwell' },
      { number: 15, label: 'CAN' },
      { number: 16, label: 'Prelim ISP' },
      { number: 17, label: 'Orientation' },
    ];

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  style={{
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  {step.number}
                </div>
                <span
                  className={`mt-2 text-xs text-center whitespace-nowrap ${
                    currentStep >= step.number
                      ? 'text-gray-800 font-medium'
                      : 'text-gray-400'
                  }`}
                  style={{
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-8 mx-1 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Step 1: Consent to Participate in Services
  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Consent to Participate in Services
      </h3>
      <p className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Certified Peer Recovery Support and Telehealth Services
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="consentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                DATE
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consentStaffName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Staff Name (who explained services)
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          I understand that participation in services is voluntary and I may end services at any time.
        </p>

        <FormField
          control={form.control}
          name="consentQuestionsAnswered"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                All my questions have been answered to my satisfaction:
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 space-y-3">
          <FormField
            control={form.control}
            name="consentAgreeToParticipate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'I DO'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'I DO' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      I DO, voluntarily agree to participate in services
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consentAgreeToParticipate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'I DO NOT'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'I DO NOT' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      I DO NOT agree to participate in services
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="consentParticipantSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Participant Signature
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consentParticipantSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field} 
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="consentStaffSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Staff Signature
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consentStaffSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field} 
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="consentSupervisorSignature"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Supervisor Signature
            </FormLabel>
            <FormControl>
              <SignaturePad
                value={field.value}
                onChange={(value) => field.onChange(value)}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  // Step 2: Privacy Practices Acknowledgment
  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Privacy Practices Acknowledgment
      </h3>

      <FormField
        control={form.control}
        name="privacyProgram"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Program
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="The Worx!-Recovery Support Worx (RSW) Program"
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          I have been given a copy of RSW's Notice of Privacy Practices, which describes:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          <li>How protected health information is used and shared</li>
          <li>Individual rights regarding protected health information</li>
          <li>RSW's legal duties regarding protected health information</li>
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="privacySignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Signature of Individual or Personal Representative
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacySignatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="privacyPrintName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Print Name
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="privacyPersonalRepTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Personal Representative's Title (e.g., Guardian, Health Care Power of Attorney)
            </FormLabel>
            <FormControl>
              <Input 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  // Step 3: Recording Authorization
  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Authorization For Video, Audio, Recording, and Photographic Participation
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
        <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          I grant permission to The Worx! and its partnering entities for the use of my image, likeness, and voice in video or still recordings for educational purposes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="recordingFullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Full Name
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recordingStreetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Street Address/P.O. Box
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recordingCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                City
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recordingState"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                State
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recordingZipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Zip Code
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recordingPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Phone
              </FormLabel>
              <FormControl>
                <Input 
                  type="tel"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recordingFax"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Fax
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recordingEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Email Address
              </FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="recordingSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Signature
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recordingSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field} 
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="recordingParentSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Parent's Signature (if applicable)
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recordingParentSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field} 
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  // Step 4: COVID-19 Screening
  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        COVID-19 Screening Questionnaire
      </h3>
      <p className="text-sm text-gray-700 italic" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        This form must be filled daily and submitted weekly.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="covidStaffParticipantVisitor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Staff/Participant/Visitor
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="covidDateWeekBeginning"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date - Week Beginning
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="covidInitialTestResult"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Initial COVID Test Result
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Neg/Pos"
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="covidInitialTestInitials"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Initials
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
        <p className="text-sm font-semibold text-yellow-800 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Instructions:
        </p>
        <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          <li>• Notify your staff immediately!</li>
          <li>• Contact the Program Manager for guidance at 412-912-0123</li>
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="covidParticipantSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Participant Signature
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="covidParticipantSignatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Step 5: Rights Acknowledgment
  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Rights to Participants
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
        <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          I acknowledge that I have been informed of my rights as a participant, including:
        </p>
        <ul className="list-decimal list-inside text-sm text-gray-700 space-y-2 ml-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          <li>To be treated with dignity and respect and to be free from physical and mental harm.</li>
          <li>To receive Certified Peer Recovery Support Services (CPS/CRS) in a culturally respectful and nondiscriminatory environment.</li>
          <li>To receive CPS/CRS Services in the least-restrictive setting that fosters recovery and promotes growth.</li>
          <li>To access competent, timely quality services to assist with fulfillment of personal goals.</li>
          <li>To express a goal which is individualized and reflects informed choice concerning selection, direction or termination of service and service plan.</li>
          <li>Choosing a service based on individual need, choice and acceptance and not dependent on compliance or participation with another treatment recovery service.</li>
          <li>To offer an opinion and belief, to express a complaint related to service and Individual Service Plan (ISP) and to have the complaint heard in a fair manner.</li>
          <li>To appeal and individual service decision.</li>
          <li>To have the assistance of a personally chosen representative or advocate in expressing a complaint or grievance.</li>
          <li>To be able to contribute to, have access to, and control the release of an individual record.</li>
          <li>To have information and records concerning service treated in a confidential manner, as required under the Health Insurance Portability and Accountability Act of 1996 (HIPAA).</li>
          <li>A participant may not be discriminated against because of race, color, religious creed, disability, handicap, ancestry, sexual orientation, national origin, age, or gender.</li>
        </ul>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="rightsSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Participant Signature
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rightsSignatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Step 6: Tobacco Cessation
  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Tobacco Cessation Screening Tool
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="tobaccoCurrentlySmoke"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Do you currently smoke or use tobacco products?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoProductsUsed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                What tobacco products do you use?
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoYearsSmoking"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                How many years have you been smoking?
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoCigarettesPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                How many cigarettes per day?
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoPreviousQuitAttempts"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Previous quit attempts?
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoHealthIssues"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Do you have any health issues related to smoking?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoUnderstandRisks"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Do you understand the health risks of smoking?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoReadyToQuit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Are you ready to quit?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoQuitDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Quit Date (if applicable)
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoSupportSystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Support System
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="tobaccoSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Signature
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tobaccoSignatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Step 7: Suicide Risk Screening
  const renderStep7 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Suicide Risk Screening Tool
      </h3>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="suicideQ1WishedDead"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                1. In the past few weeks, have you wished you were dead?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suicideQ2FamilyBetterOff"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                2. In the past few weeks, have you felt that you or your family would be better off if you were dead?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suicideQ3ThoughtsKillingSelf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                3. In the past week, have you been having thoughts about killing yourself?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suicideQ4EverTriedKillSelf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                4. Have you ever tried to kill yourself?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('suicideQ4EverTriedKillSelf') === 'Yes' && (
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="suicideQ4How"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    If yes, how?
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suicideQ4When"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    When?
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="suicideQ5ThoughtsKillingNow"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                5. Are you having thoughts of killing yourself right now?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('suicideQ5ThoughtsKillingNow') === 'Yes' && (
          <FormField
            control={form.control}
            name="suicideQ5Describe"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  If yes, please describe:
                </FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm font-semibold text-red-800 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Resources:
          </p>
          <ul className="list-disc list-inside text-sm text-red-800 space-y-1" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <li>24/7 National Suicide Prevention Lifeline: 988</li>
            <li>24/7 Crisis Text Line: Text "HOME" to 741741</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="suicideSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Participant Signature
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="suicideSignatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Step 8: Homicide Risk Assessment
  const renderStep8 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Homicide Risk Assessment Form
      </h3>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="homicideThoughtsHarmingOthers"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Are you currently having any thoughts about harming others?
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'Yes'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value === 'No'}
                      onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                    />
                    <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('homicideThoughtsHarmingOthers') === 'Yes' && (
          <>
            <FormField
              control={form.control}
              name="homicideTimeThinkingHarm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Do you spend time thinking about harming others?
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value === 'Yes'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                        />
                        <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value === 'No'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                        />
                        <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="homicideWho"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      1. Who
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homicideWhenHarm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      2. When
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homicideWhereHarm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      3. Where
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="homicidePlanToHarm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      Do you have a plan to harm others?
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value === 'Yes'}
                            onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                          />
                          <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value === 'No'}
                            onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                          />
                          <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homicideAccessMeans"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      Do you have access to means to harm others?
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value === 'Yes'}
                            onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                          />
                          <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value === 'No'}
                            onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                          />
                          <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="homicideHistoryViolence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    History of violence?
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value === 'Yes'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                        />
                        <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value === 'No'}
                          onCheckedChange={(checked) => field.onChange(checked ? 'No' : undefined)}
                        />
                        <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>No</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Environmental Risk Factors (Check All That Apply)
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {['Access to weapons', 'Substance use', 'History of violence', 'Gang involvement', 'Criminal history'].map((factor) => (
                <FormField
                  key={factor}
                  control={form.control}
                  name="homicideEnvironmentalRiskFactors"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(factor)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            field.onChange(
                              checked
                                ? [...current, factor]
                                : current.filter((f) => f !== factor)
                            );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {factor}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Protective Factors (Check All That Apply)
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {['Fear of death', 'Sense of purpose/responsibility', 'Reason to live', 'Social support system', 'Religious/Spiritual beliefs'].map((factor) => (
                <FormField
                  key={factor}
                  control={form.control}
                  name="homicideProtectiveFactors"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(factor)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            field.onChange(
                              checked
                                ? [...current, factor]
                                : current.filter((f) => f !== factor)
                            );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {factor}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="homicideAssessmentRisk"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Assessment of Risk
                </FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    {['Low', 'Moderate', 'High'].map((risk) => (
                      <div key={risk} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value === risk}
                          onCheckedChange={(checked) => field.onChange(checked ? risk : undefined)}
                        />
                        <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>{risk}</span>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="homicideResourceGuideProvided"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Resource Guide Provided
                </FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value === 'Yes'}
                        onCheckedChange={(checked) => field.onChange(checked ? 'Yes' : undefined)}
                      />
                      <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Yes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value === 'Participant Decline'}
                        onCheckedChange={(checked) => field.onChange(checked ? 'Participant Decline' : undefined)}
                      />
                      <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>Participant Decline</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="homicideSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Participant Signature
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="homicideSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field} 
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  // Step 9: Staff Use Only Risk Assessment
  const renderStep9 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Staff Use Only - Risk Assessment
      </h3>

      <div className="border-t-2 border-dashed border-gray-400 py-4">
        <p className="text-center text-sm font-semibold text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          ---Staff Use Only---
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          <thead>
            <tr>
              <th className="border border-gray-300 bg-yellow-100 p-2 text-left text-sm font-semibold text-gray-800">
                Risk Level
              </th>
              <th className="border border-gray-300 bg-gray-100 p-2 text-left text-sm font-semibold text-gray-800">
                Risk/Protective Factors
              </th>
              <th className="border border-gray-300 bg-gray-100 p-2 text-left text-sm font-semibold text-gray-800">
                Suicidality/Homicidality
              </th>
              <th className="border border-gray-300 bg-gray-100 p-2 text-left text-sm font-semibold text-gray-800">
                Possible Interventions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 text-sm font-semibold text-gray-800 bg-yellow-50">
                High Risk
              </td>
              <td className="border border-gray-300 p-2 text-sm text-gray-700">
                Multiple risk factors including intent/plan; psychiatric disorders with severe symptoms; no protective factors.
              </td>
              <td className="border border-gray-300 p-2 text-sm text-gray-700">
                Suicide/Homicide thoughts with plan, intent, available means of lethal use.
              </td>
              <td className="border border-gray-300 p-2 text-sm text-gray-700">
                Duty to Warn/Report; refer to hospital; call police authorities.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm font-semibold text-gray-800 bg-yellow-50">
                Moderate Risk
              </td>
              <td className="border border-gray-300 p-2 text-sm text-gray-700">
                Multiple risk factors, few protective factors; S/H ideation/thoughts with some control of acting on them.
              </td>
              <td className="border border-gray-300 p-2 text-sm text-gray-700">
                S/H with plan but no intent or behavior.
              </td>
              <td className="border border-gray-300 p-2 text-sm text-gray-700">
                Develop a crisis/safety plan.
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 text-sm font-semibold text-gray-800 bg-yellow-50">
                Low Risk
              </td>
              <td className="border border-gray-300 p-2 text-sm text-gray-700">
                Low risk factors, strong protective factors; thoughts but no intent.
              </td>
              <td className="border border-gray-300 p-2 text-sm text-gray-700">
                Thoughts of S/H but no plan, intent, or behavior.
              </td>
              <td className="border border-gray-300 p-2 text-sm text-gray-700">
                Outside services referral; develop safety plan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="staffRiskLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Selected Risk Level
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  {['High Risk', 'Moderate Risk', 'Low Risk'].map((risk) => (
                    <div key={risk} className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value === risk}
                        onCheckedChange={(checked) => field.onChange(checked ? risk : undefined)}
                      />
                      <span className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>{risk}</span>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staffRiskProtectiveFactors"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Risk/Protective Factors
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  placeholder="Describe risk and protective factors..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staffSuicidalityHomicidality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Suicidality/Homicidality
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  placeholder="Describe suicidality/homicidality indicators..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staffPossibleInterventions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Possible Interventions
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-20"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  placeholder="Describe possible interventions..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Low Risk
          </p>
          <div className="space-y-2">
            {['Continue monitoring/counseling', 'Involve other personnel if necessary'].map((action) => (
              <FormField
                key={action}
                control={form.control}
                name="staffLowRiskActions"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(action)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          field.onChange(
                            checked
                              ? [...current, action]
                              : current.filter((f) => f !== action)
                          );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {action}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            Moderate/High Risk
          </p>
          <div className="space-y-2">
            {['Consult with supervisor on how to manage'].map((action) => (
              <FormField
                key={action}
                control={form.control}
                name="staffModerateHighRiskActions"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(action)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          field.onChange(
                            checked
                              ? [...current, action]
                              : current.filter((f) => f !== action)
                          );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {action}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="staffAdditionalComments"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Additional Comments
            </FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                placeholder="Enter any additional comments..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="staffRiskStaffSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Staff Signature
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staffRiskStaffSignatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date
              </FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...field} 
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Step 10: Overdose Risk Screening
  const renderStep10 = () => {
    const calculateTotalScore = () => {
      const scores = [
        form.watch('overdoseCurrentHeroinUser'),
        form.watch('overdoseCurrentInjector'),
        form.watch('overdoseStartedInjectingSixMonths'),
        form.watch('overdoseCurrentMethadonePrescribed'),
        form.watch('overdoseCurrentMethadoneStreet'),
        form.watch('overdoseNotSupervisedConsumption'),
        form.watch('overdoseAlsoDrinksAlcohol'),
        form.watch('overdoseUsesBenzodiazepines'),
        form.watch('overdoseDualUseHeroinCrack'),
        form.watch('overdosePrisonHospitalTreatmentMonth'),
        form.watch('overdoseEverOverdosed'),
        form.watch('overdoseOverdosedOncePastYear'),
        form.watch('overdoseOverdosedTwicePastYear'),
        form.watch('overdoseUsingMoreFiveYears'),
        form.watch('overdoseUsingLargeAmounts'),
        form.watch('overdoseHarderGetBuzz'),
        form.watch('overdoseEnjoysBigGouch'),
        form.watch('overdoseProneLowMood'),
        form.watch('overdoseTendsUseAlone'),
        form.watch('overdoseHasHealthProblems'),
        form.watch('overdoseErraticPatternsUse'),
      ].filter((score) => score !== undefined && score !== null) as number[];
      
      const total = scores.reduce((sum, score) => sum + (score || 0), 0);
      form.setValue('overdoseTotalScore', total);
      
      if (total <= 3) {
        form.setValue('overdoseRiskLevel', 'Low risk');
      } else if (total <= 7) {
        form.setValue('overdoseRiskLevel', 'Moderate risk');
      } else {
        form.setValue('overdoseRiskLevel', 'High risk');
      }
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Overdose Risk Screening Assessment Tool
        </h3>
        <p className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Instructions: If the answer to a question is &lt;yes&gt; circle the score; if &lt;no&gt; record no score for that question.
        </p>

        <div className="space-y-4">
          {[
            { name: 'overdoseCurrentHeroinUser', label: 'Current heroin user', score: 1 },
            { name: 'overdoseCurrentInjector', label: 'Current injector', score: 2 },
            { name: 'overdoseStartedInjectingSixMonths', label: 'Has started injecting in last six months', score: 3 },
            { name: 'overdoseCurrentMethadonePrescribed', label: 'Current methadone user (prescribed)', score: 1 },
            { name: 'overdoseCurrentMethadoneStreet', label: 'Current methadone user (street)', score: 2 },
            { name: 'overdoseNotSupervisedConsumption', label: 'Is not on supervised consumption', score: 2 },
            { name: 'overdoseAlsoDrinksAlcohol', label: 'Also drinks alcohol', score: 2 },
            { name: 'overdoseUsesBenzodiazepines', label: 'Also uses benzodiazepines (e.g. Diazepam)', score: 2 },
            { name: 'overdoseDualUseHeroinCrack', label: 'Dual use of heroin and crack', score: 2 },
            { name: 'overdosePrisonHospitalTreatmentMonth', label: 'Has been in prison, hospital or residential drugs treatment in preceding month', score: 3 },
            { name: 'overdoseEverOverdosed', label: 'Has ever overdosed (but not in past year)', score: 1 },
            { name: 'overdoseOverdosedOncePastYear', label: 'Has overdosed once in past year', score: 2 },
            { name: 'overdoseOverdosedTwicePastYear', label: 'Has overdosed two or more times in past year', score: 3 },
            { name: 'overdoseUsingMoreFiveYears', label: 'Has been using for more than five years', score: 1 },
            { name: 'overdoseUsingLargeAmounts', label: 'Is using large amounts to get a buzz', score: 1 },
            { name: 'overdoseHarderGetBuzz', label: 'Finds it harder to get a buzz', score: 2 },
            { name: 'overdoseEnjoysBigGouch', label: 'Enjoys a really big \'gouch\' or \'nod\'', score: 3 },
            { name: 'overdoseProneLowMood', label: 'Prone to low mood or depression', score: 3 },
            { name: 'overdoseTendsUseAlone', label: 'Tends to use alone', score: 3 },
            { name: 'overdoseHasHealthProblems', label: 'Has health problems (e.g. hepatitis, respiratory problems)', score: 2 },
            { name: 'overdoseErraticPatternsUse', label: 'Has erratic patterns of use (different dealers, drugs, amounts, routes, combinations)', score: 2 },
          ].map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name as keyof FormValues}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-semibold text-gray-800 flex-1" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {item.label}
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        Score: {item.score}
                      </span>
                      <Input
                        type="number"
                        min="0"
                        max={item.score}
                        value={field.value || ''}
                        onChange={(e) => {
                          const val = e.target.value ? parseInt(e.target.value) : undefined;
                          field.onChange(val === item.score ? val : undefined);
                          setTimeout(calculateTotalScore, 100);
                        }}
                        className="w-16 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="overdoseTotalScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Total Score
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field} 
                      value={field.value || ''}
                      readOnly
                      className="rounded-lg border-gray-300 bg-gray-100"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overdoseRiskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Risk Level
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value || ''}
                      readOnly
                      className="rounded-lg border-gray-300 bg-gray-100"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              <strong>Score Interpretation:</strong><br />
              Low risk (0-3): While there is always a risk of overdose, the person has a relatively low risk profile.<br />
              Moderate risk (4-7): Increased risk factors present. Additional monitoring and support recommended.<br />
              High risk (8+): Significant risk factors present. Immediate intervention and close monitoring required.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="overdoseStaffSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Staff Signature
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overdoseStaffCredentials"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Credentials
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="CRS"
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="overdoseSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Participant Signature
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="overdoseSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date"
                    {...field} 
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  };

  // Step 11: MAUD/MOUD Education
  const renderStep11 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        MAUD/MOUD Education Checklist and Acknowledgement
      </h3>

      <div className="space-y-4">
        {[
          {
            name: 'maudEducationProvidedIntake',
            participantInitials: 'maudEducationProvidedIntakeParticipantInitials',
            staffInitials: 'maudEducationProvidedIntakeStaffInitials',
            label: 'During my intake and/or within a week of my services start date, I was provided with the education regarding my AUD and/or OUD diagnosis.'
          },
          {
            name: 'maudThoroughEducationBenefitsRisks',
            participantInitials: 'maudThoroughEducationBenefitsRisksParticipantInitials',
            staffInitials: 'maudThoroughEducationBenefitsRisksStaffInitials',
            label: 'I have been provided thorough education on the benefits and risks of FDA approved medications.'
          },
          {
            name: 'maudEducatedOverdoseRisks',
            participantInitials: 'maudEducatedOverdoseRisksParticipantInitials',
            staffInitials: 'maudEducatedOverdoseRisksStaffInitials',
            label: 'I have been provided with a thorough education on the overdose risks associated with'
          },
          {
            name: 'maudEducatedNaloxoneOverview',
            participantInitials: 'maudEducatedNaloxoneOverviewParticipantInitials',
            staffInitials: 'maudEducatedNaloxoneOverviewStaffInitials',
            label: 'I have been provided with overview of Naloxone, including how to access during treatment and why needed before leaving.'
          },
          {
            name: 'maudEducatedPrescriptionPharmacies',
            participantInitials: 'maudEducatedPrescriptionPharmaciesParticipantInitials',
            staffInitials: 'maudEducatedPrescriptionPharmaciesStaffInitials',
            label: 'I have been educated on: Prescription provided with participating pharmacies'
          },
          {
            name: 'maudEducatedInstructionsPirFamily',
            participantInitials: 'maudEducatedInstructionsPirFamilyParticipantInitials',
            staffInitials: 'maudEducatedInstructionsPirFamilyStaffInitials',
            label: 'I have been educated on: Instructions provided to PIR/family on how to acquire medication'
          },
          {
            name: 'maudEducatedNaloxoneProvided',
            participantInitials: 'maudEducatedNaloxoneProvidedParticipantInitials',
            staffInitials: 'maudEducatedNaloxoneProvidedStaffInitials',
            label: 'I have been educated on: Naloxone medication provided to the member'
          },
          {
            name: 'maudEducatedPharmaciesStockNaloxone',
            participantInitials: 'maudEducatedPharmaciesStockNaloxoneParticipantInitials',
            staffInitials: 'maudEducatedPharmaciesStockNaloxoneStaffInitials',
            label: 'I have been educated on: Provider identified pharmacies willing to stock naloxone'
          },
          {
            name: 'maudEducatedRelapseRisk',
            participantInitials: 'maudEducatedRelapseRiskParticipantInitials',
            staffInitials: 'maudEducatedRelapseRiskStaffInitials',
            label: 'I have been educated on the relapse risk associated with a SUD during and after treatment (exceptionally high and dangerous for OUD) and how medications could help the me manage the risk during and after leaving treatment'
          },
          {
            name: 'maudEducatedRelapsePrevention',
            participantInitials: 'maudEducatedRelapsePreventionParticipantInitials',
            staffInitials: 'maudEducatedRelapsePreventionStaffInitials',
            label: 'I have been educated and offered opportunities to attend both group and individual sessions on relapse prevention.'
          },
          {
            name: 'maudEducatedCommunityCareWebsite',
            participantInitials: 'maudEducatedCommunityCareWebsiteParticipantInitials',
            staffInitials: 'maudEducatedCommunityCareWebsiteStaffInitials',
            label: 'I have been educated on how to access Community Care website for additional resources, file complaints, etc.'
          },
          {
            name: 'maudEducatedTriggersCravings',
            participantInitials: 'maudEducatedTriggersCravingsParticipantInitials',
            staffInitials: 'maudEducatedTriggersCravingsStaffInitials',
            label: 'I have been informed about triggers, cravings and how medications assist with craving management.'
          },
          {
            name: 'maudEducatedRightsFreedomChoice',
            participantInitials: 'maudEducatedRightsFreedomChoiceParticipantInitials',
            staffInitials: 'maudEducatedRightsFreedomChoiceStaffInitials',
            label: 'I have been informed of my rights and freedom of choice for medication or non-medication assisted treatment.'
          },
          {
            name: 'maudEducatedMedicationAccessInstructions',
            participantInitials: 'maudEducatedMedicationAccessInstructionsParticipantInitials',
            staffInitials: 'maudEducatedMedicationAccessInstructionsStaffInitials',
            label: 'I have been provided with instructions on how to access medications within days of the assessment and/or within days of transition from a hospitalization or an inpatient stay or any other facilities where medication was administered.'
          },
        ].map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3 mb-3">
              <FormField
                control={form.control}
                name={item.name as keyof FormValues}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value as boolean || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <p className="text-sm text-gray-700 flex-1" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {item.label}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 ml-8">
              <FormField
                control={form.control}
                name={item.participantInitials as keyof FormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      Participant Initials
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={item.staffInitials as keyof FormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      Staff Initials
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          My signature certifies that I have been educated on AOD/OUD and carefully reviewed all information with staff. I hereby acknowledge my full understanding of the resources and materials provided.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="maudParticipantSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Participant Signature
                  </FormLabel>
                  <FormControl>
                    <SignaturePad
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maudParticipantSignatureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Date
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      {...field} 
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="maudStaffSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Staff Signature
                  </FormLabel>
                  <FormControl>
                    <SignaturePad
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maudStaffSignatureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Date
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="date"
                      {...field} 
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Step 12: SNAP Assessment
  const renderStep12 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        SNAP Assessment
      </h3>
      <p className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        This form is used to evaluate an individual's Strengths, Needs, Abilities, and Preferences to determine the most appropriate service plan for their specific situation.
      </p>

      {/* Strengths */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          STRENGTHS: What personal qualities do you have which we can build upon in treatment?
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            'open_minded', 'friendly', 'creative', 'good_listener', 'quick_learner', 'dependable',
            'motivation', 'good_grooming', 'organized', 'takes_responsibility', 'spiritual_values',
            'independent', 'assertive', 'hard_worker', 'learn_from_experiences', 'collaborate',
            'problem_solver', 'decision_maker', 'good_health'
          ].map((strength) => (
            <FormField
              key={strength}
              control={form.control}
              name={`snapStrengths.${strength}` as any}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal text-gray-700 capitalize" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {strength.replace(/_/g, ' ')}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="snapStrengthsOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Other (Please List)
              </FormLabel>
              <FormControl>
                <Input {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Needs */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h4 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          NEEDS: What would help you achieve your goals? Please, check your most important needs. (Prioritize your top three)
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { key: 'increase_knowledge_resources', label: 'Increase my knowledge of resources that provide me with support.' },
            { key: 'job_training_education', label: 'Referral to resources for job training or education.' },
            { key: 'medical_care', label: 'Access to medical care for health related concerns.' },
            { key: 'sober_environment', label: 'Staying in a sober environment to help me not use drugs and or alcohol.' },
            { key: 'mental_health_diagnosis', label: 'Gain more knowledge and understanding about: My mental health diagnosis' },
            { key: 'medication_knowledge', label: 'Gain more knowledge and understanding about: My medication(s)' },
            { key: 'symptoms_behaviors', label: 'Gain more knowledge and understanding about: My symptoms / behaviors related to my mental health diagnosis' },
            { key: 'empowerment', label: 'Learn how to empower myself to take a more active role in my treatment.' },
            { key: 'communication_skills', label: 'Increasing effective communication skills to improve my relationships with others.' },
            { key: 'talk_concerns', label: 'Learn how to talk about my concerns/issues/feelings.' },
            { key: 'practice_coping_skills', label: 'Practice my coping skills in a safe environment.' },
            { key: 'coping_sleep', label: 'Learn more about effective coping skills related to: Improving my sleep' },
            { key: 'coping_anxiety', label: 'Learn more about effective coping skills related to: Reducing anxiety and using relaxation' },
            { key: 'coping_depression', label: 'Learn more about effective coping skills related to: Managing my depression' },
            { key: 'coping_leisure', label: 'Learn more about effective coping skills related to: Leisure skills' },
            { key: 'coping_organizing', label: 'Learn more about effective coping skills related to: Organizing daily activities' },
            { key: 'coping_anger', label: 'Learn more about effective coping skills related to: Managing anger' },
            { key: 'coping_mood_regulation', label: 'Learn more about effective coping skills related to: Mood Regulation' },
            { key: 'coping_reality_thinking', label: 'Learn more about effective coping skills related to: Improving reality-based thinking' },
            { key: 'coping_eating_healthy', label: 'Learn more about effective coping skills related to: Eating Healthy' },
            { key: 'stop_smoking', label: 'Get help to stop smoking' },
          ].map((need) => (
            <FormField
              key={need.key}
              control={form.control}
              name={`snapNeeds.${need.key}` as any}
              render={({ field }) => (
                <FormItem className="flex items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal text-gray-700 flex-1" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {need.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="snapNeedsOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Other (Please List)
              </FormLabel>
              <FormControl>
                <Input {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Abilities */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h4 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          ABILITIES: What skills do you possess?
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            'read_write', 'computer_skills', 'work_with_others', 'manage_emotions',
            'positive_relationships', 'job_skills', 'healthy_decisions', 'time_management'
          ].map((ability) => (
            <FormField
              key={ability}
              control={form.control}
              name={`snapAbilities.${ability}` as any}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal text-gray-700 capitalize" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {ability.replace(/_/g, ' ')}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="snapAbilitiesEducationTraining"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Education/Training
                </FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="snapAbilitiesLeisureSkills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Leisure Skills
                </FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="snapAbilitiesOther"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Other (Please List)
              </FormLabel>
              <FormControl>
                <Input {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Preferences */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h4 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          PREFERENCES: How do you want your treatment?
        </h4>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              I learn new information better:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {['hands_on', 'face_to_face', 'reading', 'alone', 'discussion', 'group_peers'].map((pref) => (
                <FormField
                  key={pref}
                  control={form.control}
                  name={`snapPreferences.learn_${pref}` as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-gray-700 capitalize" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {pref.replace(/_/g, ' ')}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              I would like to live:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {['independently', 'community_support', 'with_others'].map((pref) => (
                <FormField
                  key={pref}
                  control={form.control}
                  name={`snapPreferences.live_${pref}` as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-gray-700 capitalize" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {pref.replace(/_/g, ' ')}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormField
              control={form.control}
              name="snapPreferencesLiveOther"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Other ideas I have about my living situation (Please List)
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              I am interested in learning more about:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {['outpatient', 'community_resources'].map((pref) => (
                <FormField
                  key={pref}
                  control={form.control}
                  name={`snapPreferences.interest_${pref}` as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal text-gray-700 capitalize" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {pref.replace(/_/g, ' ')}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormField
              control={form.control}
              name="snapPreferencesInterestOther"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Other areas of interest (Please List)
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`snapPreferences.family_involved` as any}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  I prefer my family or friends to be involved in my treatment
                </FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`snapPreferences.family_meeting` as any}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0 ml-6">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  I would like to have a family meeting
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Signatures */}
      <div className="grid gap-4 md:grid-cols-2 pt-6 border-t border-gray-200">
        <FormField
          control={form.control}
          name="snapParticipantSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Participant Signature
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapParticipantSignatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapStaffSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Staff Signature/Title
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="snapStaffTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Title
                </FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="snapStaffSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  // Step 13: SNAP Outcomes Preliminary ISP Form
  const renderStep13 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        SNAP Outcomes Preliminary ISP Form
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="snapOutcomesDateOfAdmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date of Admission
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapOutcomesDateCompleted"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date Completed
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapOutcomesDateIspDue"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date ISP Due
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="snapOutcomesHasWrapPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Do you have a WRAP Plan: Yes or No
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Yes or No" className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapOutcomesWantsWrapPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Do you want a WRAP Plan: Yes or No
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Yes or No" className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-4">
        <h4 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Domain
        </h4>
        <FormField
          control={form.control}
          name="snapOutcomesDomainLiving"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Living/Self-Maintenance:
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapOutcomesDomainEducation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Education/Vocational/Employment:
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapOutcomesDomainHealth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Health/Wellness:
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapOutcomesDomainSocializing"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Socializing:
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h4 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Checklist
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            'verbalize_physical_needs', 'complete_medical_assessment', 'verbalize_emotional_needs',
            'verbalize_program_questions', 'complete_assessment', 'verbalize_recovery_needs',
            'begin_treatment_services', 'begin_socializing'
          ].map((goal) => (
            <FormField
              key={goal}
              control={form.control}
              name={`snapOutcomesGoals.${goal}` as any}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal text-gray-700 capitalize" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    To {goal.replace(/_/g, ' ')}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="snapOutcomesGoalIdentifyFamily"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                To identify option for connecting/Vocational/Educational reconnecting with family as I define it.
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapOutcomesAdditionalGoals"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Additional Goals:
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 pt-6 border-t border-gray-200">
        <FormField
          control={form.control}
          name="snapOutcomesParticipantSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Participant Signature
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="snapOutcomesParticipantSignatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Step 14: Camberwell Assessment Outcomes Form
  const renderStep14 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Camberwell Assessment Outcomes Form (CPS ONLY!)
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="camberwellOutcomesDateOfAdmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date of Admission
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="camberwellOutcomesDateCompleted"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date Completed
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="camberwellOutcomesDateIspDue"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date ISP Due
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="camberwellOutcomesHasWrapPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Do you have a WRAP Plan: Yes or No
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Yes or No" className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="camberwellOutcomesWantsWrapPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Do you want a WRAP Plan: Yes or No
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Yes or No" className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="camberwellOutcomesConcerns"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              Areas of Unmet or Not Known Needs (2s or 9s)
            </FormLabel>
            <FormControl>
              <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-32" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h4 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Goals:
        </h4>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            'verbalize_physical_needs', 'complete_medical_assessment', 'verbalize_emotional_needs',
            'verbalize_program_questions', 'complete_assessment', 'verbalize_recovery_needs',
            'begin_treatment_services', 'begin_socializing'
          ].map((goal) => (
            <FormField
              key={goal}
              control={form.control}
              name={`camberwellOutcomesGoals.${goal}` as any}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal text-gray-700 capitalize" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    To {goal.replace(/_/g, ' ')}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="camberwellOutcomesGoalIdentifyFamily"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                To identify option for connecting/Vocational/Educational reconnecting with family as I define it.
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="camberwellOutcomesAdditionalGoals"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Additional Goals:
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 pt-6 border-t border-gray-200">
        <FormField
          control={form.control}
          name="camberwellOutcomesParticipantSignature"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Participant Signature
              </FormLabel>
              <FormControl>
                <SignaturePad
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="camberwellOutcomesParticipantSignatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Step 15: Camberwell Assessment of Need (CAN)
  const renderStep15 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Camberwell Assessment of Need (CAN) - CPS ONLY
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="canAssessmentNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Assessment number
              </FormLabel>
              <FormControl>
                <Input {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="canInterviewed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Circle who is interviewed (U = Service user, S = Staff, C = Carer)
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="U, S, or C" className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="canDateOfAssessment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Date of assessment
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="canAssessorInitials"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Initials of assessor
              </FormLabel>
              <FormControl>
                <Input {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          <strong>Need rating:</strong> N = No need, M = Met need, U = Unmet need, ? = Not known
        </p>
        <p className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          The CAN assessment includes 22 categories. For a complete implementation, this would require a comprehensive table with all categories and assessment points. The data will be stored in JSONB format for flexibility.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="canTotalMetNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                A Total Met needs - count the number of M's in the column
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="canTotalUnmetNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                B Total Unmet needs - count the number of U's in the column
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="canTotalNumberNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                C Total number of needs - add together A + B
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  // Step 16: Preliminary ISP Form
  const renderStep16 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        Preliminary ISP Form
      </h3>
      <div className="space-y-4">
        <h4 className="text-base font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Action Steps:
        </h4>
        <div className="space-y-3">
          {[
            { key: 'reach_natural_supports', label: 'I will reach out to natural supports' },
            { key: 'attend_self_help', label: 'I will attend self-help support' },
            { key: 'improve_physical_wellness', label: 'I will improve my physical wellness' },
            { key: 'improve_mental_health_wellness', label: 'I will improve my mental health wellness' },
            { key: 'meet_cps_crs', label: 'I will meet with my CPS/CRS' },
          ].map((action) => (
            <FormField
              key={action.key}
              control={form.control}
              name={`preliminaryIspActions.${action.key}` as any}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal text-gray-700 flex-1" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {action.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="preliminaryIspActionMeetCpsCrsName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  CPS/CRS Name
                </FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preliminaryIspActionMeetCpsCrsTimes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Times per Week
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="preliminaryIspAdditionalActions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                Additional Action Steps:
              </FormLabel>
              <FormControl>
                <Textarea {...field} className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500 min-h-24" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="preliminaryIspParticipantSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Participant Signature
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preliminaryIspParticipantSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="preliminaryIspCpsCrsSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  CPS/CRS Signature
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preliminaryIspCpsCrsSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="preliminaryIspCpsCrsSupervisorSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  CPS/CRS Supervisor Signature
                </FormLabel>
                <FormControl>
                  <SignaturePad
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="preliminaryIspCpsCrsSupervisorSignatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                  Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  // Step 18: Orientation Confirmation
  const renderStep18 = () => {
    const policies = [
      { key: 'vital_records', label: 'Vital Records-(If Applicable)' },
      { key: 'admission_criteria', label: 'Admission Criteria' },
      { key: 'services', label: 'Services' },
      { key: 'goals_achieved', label: 'Goals to be Achieved in RSW' },
      { key: 'recovery_values', label: 'Program Recovery Values and Core Principles' },
      { key: 'confidentiality', label: 'Confidentiality Policy 1+2' },
      { key: 'nondiscrimination', label: 'Nondiscrimination in Services' },
      { key: 'grievance_procedures', label: 'Rights Violations/Grievance Procedures' },
      { key: 'emergency_phone_numbers', label: 'Emergency Phone Numbers' },
      { key: 'discharge_termination', label: 'Discharge/Termination Policy' },
      { key: 'consent_participate', label: 'Consent to Participate in Services' },
      { key: 'privacy_practices', label: 'Notice of Privacy Practices' },
      { key: 'rights_participants', label: 'Rights of Participants' },
      { key: 'audio_photo_video', label: 'Audio, Photo, Video, Recording and Interview Consent' },
      { key: 'allergy_covid_medication', label: 'Allergy, COVID and Medication Screen' },
      { key: 'tobacco_cessation', label: 'Tobacco Cessation' },
      { key: 'homicide_suicide_risk', label: 'Homicide/Suicide Risk Assessment' },
      { key: 'overdose_risk', label: 'Overdose Risk Assessment' },
      { key: 'maud_moud_acknowledgement', label: 'MAUD/MOUD Acknowledgement' },
      { key: 'canfor', label: 'CANFOR (Required for CPS Only!)' },
      { key: 'snap_preliminary_isp', label: 'SNAP/Preliminary ISP Form' },
    ];

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          Orientation Confirmation
        </h3>
        <p className="text-sm text-gray-700" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
          As part of my orientation to The Worx! services, I have received the following material in my Participant Handbook:
        </p>
        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.key} className="border border-gray-200 rounded-lg p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <p className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {policy.label}
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name={`orientationPolicies.${policy.key}_date` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid gap-2 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`orientationPolicies.${policy.key}_staff_initials` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                          Staff Initials
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`orientationPolicies.${policy.key}_participant_initials` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                          Participant Initials
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            I, <strong>{form.watch('participantName') || '[Participant Name]'}</strong> have received a Participant Handbook containing all of the above policies and information and have reviewed them carefully with staff and hereby acknowledge my full understanding of these materials.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="orientationParticipantSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Participant Signature
                  </FormLabel>
                  <FormControl>
                    <SignaturePad
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orientationParticipantSignatureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orientationStaffSignature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Staff Signature
                  </FormLabel>
                  <FormControl>
                    <SignaturePad
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orientationStaffSignatureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="relative w-full min-h-screen py-8 md:py-12"
      style={{
        background: '#FFFEF7'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Card 
          className="shadow-xl border-0 bg-white"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 uppercase"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                PARTICIPANT HANDBOOK
              </h1>
              <p 
                className="text-sm text-gray-600"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Please complete all required forms
              </p>
            </div>

            {renderProgressIndicator()}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Common participant info - shown on first step */}
                {currentStep === 1 && (
                  <div className="space-y-4 pb-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 mb-4" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      Participant Information
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="participantName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                              Participant Name
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="participantDob"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                              Date of Birth
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date"
                                {...field} 
                                className="rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
                {currentStep === 5 && renderStep5()}
                {currentStep === 6 && renderStep6()}
                {currentStep === 7 && renderStep7()}
                {currentStep === 8 && renderStep8()}
                {currentStep === 9 && renderStep9()}
                {currentStep === 10 && renderStep10()}
                {currentStep === 11 && renderStep11()}
                {currentStep === 12 && renderStep12()}
                {currentStep === 13 && renderStep13()}
                {currentStep === 14 && renderStep14()}
                {currentStep === 15 && renderStep15()}
                {currentStep === 16 && renderStep16()}
                {currentStep === 18 && renderStep18()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center gap-2"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Previous</span>
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-2 rounded-lg shadow-md"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      <span className="text-sm font-medium">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-2 rounded-lg shadow-md"
                      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm font-medium">Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium">Submit</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

