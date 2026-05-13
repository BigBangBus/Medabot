/* =========================================================
   Medabot — Data layer (ported from lowfi prototype)
   ========================================================= */

/* ===== Pharmaceutical forms ===== */
const MED_FORMS = {
  comprimido: { label: 'Pill',       icon: '💊' },
  capsula:    { label: 'Capsule',    icon: '💊' },
  xarope:     { label: 'Syrup',      icon: '🧴' },
  gotas:      { label: 'Drops',      icon: '💧' },
  saqueta:    { label: 'Sachet',     icon: '📦' },
  pomada:     { label: 'Ointment',   icon: '🧴' },
  inalador:   { label: 'Inhaler',    icon: '🌬️' },
  injetavel:  { label: 'Injection',  icon: '💉' },
  colirio:    { label: 'Eye drops',  icon: '👁️' },
  patch:      { label: 'Patch',      icon: '🩹' },
  supositorio:{ label: 'Suppository',icon: '💊' },
};
function formLabel(form) { return (MED_FORMS[form] || MED_FORMS.comprimido).label; }
function formIcon(form)  { return (MED_FORMS[form] || MED_FORMS.comprimido).icon; }

/* ===== Full medication library (for autocomplete + search) ===== */
const ALL_MEDS = [
  // Analgesics / Anti-inflammatories
  { name:'Ben-U-Ron 1000mg', sub:'Paracetamol · Analgesic', form:'comprimido' },
  { name:'Ben-U-Ron 500mg',  sub:'Paracetamol · Analgesic', form:'comprimido' },
  { name:'Paracetamol 500mg', sub:'Analgesic · Antipyretic', form:'comprimido' },
  { name:'Paracetamol 1000mg', sub:'Analgesic · Antipyretic', form:'comprimido' },
  { name:'Brufen 400mg', sub:'Ibuprofen · Anti-inflammatory', form:'comprimido' },
  { name:'Brufen 600mg', sub:'Ibuprofen · Anti-inflammatory', form:'comprimido' },
  { name:'Ibuprofen 400mg', sub:'Anti-inflammatory', form:'comprimido' },
  { name:'Ibuprofen 600mg', sub:'Anti-inflammatory', form:'comprimido' },
  { name:'Nurofen 200mg', sub:'Ibuprofen · Anti-inflammatory', form:'comprimido' },
  { name:'Voltaren 50mg', sub:'Diclofenac · Anti-inflammatory', form:'comprimido' },
  { name:'Voltaren Emulgel 1%', sub:'Diclofenac · Topical', form:'pomada' },
  { name:'Naproxen 500mg', sub:'Anti-inflammatory', form:'comprimido' },
  { name:'Aspirin 500mg', sub:'Acetylsalicylic acid', form:'comprimido' },
  { name:'Aspirin 100mg', sub:'Cardioprotector', form:'comprimido' },
  // Antibiotics
  { name:'Amoxicillin 500mg',  sub:'Antibiotic · Penicillin', form:'capsula' },
  { name:'Amoxicillin 875mg',  sub:'Antibiotic · Penicillin', form:'comprimido' },
  { name:'Amoxicillin 1000mg', sub:'Antibiotic · Penicillin', form:'comprimido' },
  { name:'Augmentin 875mg+125mg', sub:'Amoxicillin + Clavulanic', form:'comprimido' },
  { name:'Azithromycin 500mg', sub:'Antibiotic · Macrolide', form:'comprimido' },
  { name:'Zithromax 250mg', sub:'Azithromycin · Antibiotic', form:'capsula' },
  { name:'Ciprofloxacin 500mg', sub:'Antibiotic · Quinolone', form:'comprimido' },
  { name:'Doxycycline 100mg', sub:'Antibiotic · Tetracycline', form:'capsula' },
  // Antidiabetics
  { name:'Metformina 500mg',  sub:'Antidiabetic · Biguanide', form:'comprimido' },
  { name:'Metformina 850mg',  sub:'Antidiabetic · Biguanide', form:'comprimido' },
  { name:'Metformina 1000mg', sub:'Antidiabetic · Biguanide', form:'comprimido' },
  { name:'Jardiance 10mg',  sub:'Empagliflozin · SGLT2', form:'comprimido' },
  { name:'Jardiance 25mg',  sub:'Empagliflozin · SGLT2', form:'comprimido' },
  { name:'Linagliptina 5mg', sub:'DPP-4 inhibitor', form:'comprimido' },
  { name:'Ozempic 0.5mg', sub:'Semaglutide · Antidiabetic', form:'injetavel' },
  { name:'Ozempic 1mg', sub:'Semaglutide · Antidiabetic', form:'injetavel' },
  { name:'Lantus 100U/ml', sub:'Glargine · Long insulin', form:'injetavel' },
  // GI
  { name:'Omeprazole 20mg', sub:'PPI · Gastric protector', form:'capsula' },
  { name:'Omeprazole 40mg', sub:'PPI · Gastric protector', form:'capsula' },
  { name:'Pantoprazole 20mg', sub:'PPI', form:'comprimido' },
  { name:'Pantoprazole 40mg', sub:'PPI', form:'comprimido' },
  { name:'Esomeprazole 20mg', sub:'Nexium · PPI', form:'comprimido' },
  { name:'Ranitidine 150mg', sub:'Antacid · H2-blocker', form:'comprimido' },
  // Anxiety / Antidepressants
  { name:'Lorazepam 1mg', sub:'Anxiolytic · Benzodiazepine', form:'comprimido' },
  { name:'Lorazepam 2.5mg', sub:'Anxiolytic · Benzodiazepine', form:'comprimido' },
  { name:'Alprazolam 0.5mg', sub:'Xanax · Anxiolytic', form:'comprimido' },
  { name:'Diazepam 5mg', sub:'Valium · Anxiolytic', form:'comprimido' },
  { name:'Sertraline 50mg', sub:'Antidepressant · SSRI', form:'comprimido' },
  { name:'Fluoxetine 20mg', sub:'Prozac · Antidepressant', form:'capsula' },
  // Cardiovascular
  { name:'Simvastatin 20mg', sub:'Cholesterol · Statin', form:'comprimido' },
  { name:'Atorvastatin 20mg', sub:'Cholesterol · Statin', form:'comprimido' },
  { name:'Ramipril 5mg', sub:'Hypertension · ACE', form:'comprimido' },
  { name:'Losartan 50mg', sub:'Hypertension · ARB', form:'comprimido' },
  { name:'Amlodipine 5mg', sub:'Hypertension · Calcium', form:'comprimido' },
  { name:'Bisoprolol 5mg', sub:'Cardio · Beta-blocker', form:'comprimido' },
  // Respiratory
  { name:'Ventolin 100mcg', sub:'Salbutamol · Bronchodilator', form:'inalador' },
  { name:'Seretide 25/125', sub:'Asthma · Corticosteroid + LABA', form:'inalador' },
  { name:'Loratadine 10mg', sub:'Antihistamine', form:'comprimido' },
  { name:'Cetirizine 10mg', sub:'Antihistamine', form:'comprimido' },
  // Thyroid / Hormonal
  { name:'Levothyroxine 50mcg', sub:'Thyroid', form:'comprimido' },
  { name:'Levothyroxine 100mcg', sub:'Thyroid', form:'comprimido' },
  // Vitamins
  { name:'Vitamin D3 25000UI', sub:'Cholecalciferol · Monthly', form:'capsula' },
  { name:'Vitamin B12 1000mcg', sub:'Cyanocobalamin', form:'comprimido' },
];

/* ===== Max daily dose defaults (for safety hints) ===== */
const MAX_DOSE_DEFAULTS = {
  'paracetamol': '4000mg', 'ben-u-ron': '4000mg',
  'ibuprofen': '1200mg', 'brufen': '1200mg',
  'amoxicillin': '3000mg', 'metformina': '2550mg', 'omeprazole': '40mg',
  'lorazepam': '6mg', 'voltaren': '150mg', 'diclofenac': '150mg',
  'jardiance': '25mg', 'empagliflozin': '25mg',
  'default': '3 tablets'
};

/* ===== User profiles ===== */
const PROFILES = {
  nuno: {
    id: 'nuno',
    name: 'User',
    greeting: 'User',
    avatar: 'assets/User.png',
    role: 'Main Profile',
    dob: '07/07/1985',
    gender: 'Male',
    conditions: ['Diabetes']
  },
  mom: {
    id: 'mom',
    name: 'User2',
    greeting: 'User2',
    avatar: 'assets/User2.png',
    role: 'Mom',
    dob: '15/03/1955',
    gender: 'Female',
    conditions: ['Hypertension']
  }
};

/* ===== State ===== */
const STATE = {
  activeProfile: 'nuno',
  guestMode: false,
  onboarding: false,
  /* Each profile owns its own medication schedule */
  medsByProfile: {
    nuno: [
      { id: 'm1', name: 'Jardiance 25mg', form: 'comprimido',
        schedule: 'daily', times: ['08:00','16:00'], dosesToday: 1, dosesTotal: 2 },
      { id: 'm2', name: 'Metformina 850mg', form: 'comprimido',
        schedule: 'daily', times: ['08:00','16:00'], dosesToday: 2, dosesTotal: 2 },
      { id: 'm3', name: 'Linagliptina 5mg', form: 'comprimido',
        schedule: 'daily', times: ['12:00'], dosesToday: 1, dosesTotal: 1 },
    ],
    mom: [
      { id: 'm10', name: 'Losartan 50mg', form: 'comprimido',
        schedule: 'daily', times: ['09:00'], dosesToday: 0, dosesTotal: 1 },
    ]
  }
};

/* ===== Convenience helpers ===== */
function getMeds() { return STATE.medsByProfile[STATE.activeProfile] || []; }
function getProfile() { return PROFILES[STATE.activeProfile]; }
