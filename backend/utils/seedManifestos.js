/**
 * Manifesto Script
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const Party = require('../models/Party');
const Manifesto = require('../models/Manifesto');
const ragService = require('../services/ragService');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vaadatrack';


const manifestoData = [

  // ══════════════════════════════════════════
  // BJP — LOK SABHA 2014
  // ══════════════════════════════════════════
  {
    partyAbbr: 'BJP',
    election: 'Lok Sabha 2014',
    year: 2014,
    electionType: 'Lok Sabha',
    summary: 'BJP 2014 manifesto focused on development, governance and national security under Modi wave.',
    text: `BJP Lok Sabha 2014 Manifesto — "Ek Bharat Shreshtha Bharat"

ECONOMY & DEVELOPMENT:
- Achieve GDP growth rate of 7-8% within 3 years through manufacturing boost and investment.
- Create 10 crore jobs in 10 years, especially for youth aged 18-35.
- Reduce fiscal deficit to 3% of GDP within 3 years through expenditure rationalization.
- Implement Goods and Services Tax (GST) to create one unified national market.
- Set up 100 new smart cities with world-class infrastructure.
- Develop industrial corridors — Delhi-Mumbai, Bengaluru-Mumbai, Chennai-Bengaluru.
- Establish manufacturing zones in every state to boost Make in India.

AGRICULTURE:
- Ensure minimum support price at least 50% above cost of production for all crops.
- Create a National Land Use Policy to prevent misuse of agricultural land.
- Provide soil health cards to all farmers within 2 years.
- Increase irrigation coverage from 45% to 65% of cultivable land by 2019.
- Establish 5000 agri-business clusters across the country.
- Implement crop insurance scheme covering all farmers at affordable premiums.
- Double farmers income within 5 years through better price realization.

GOVERNANCE:
- Repeal or revamp 25% of existing laws that are redundant or outdated within first year.
- Create a National e-Governance plan to digitize all government services.
- Establish fast-track courts to reduce pending cases — target zero pending cases in 3 years.
- End VIP culture — remove red beacons from non-essential vehicles.
- Implement e-cabinet to reduce paper use and speed up government decision making.
- Create a separate law for white collar crimes and corporate fraud.
- Bring back black money stashed abroad within 100 days of assuming power.

INFRASTRUCTURE:
- Build 100 km of road every day under Bharatmala project.
- Connect all villages with population above 500 through paved roads.
- Complete Delhi-Mumbai Industrial Corridor and establish 5 new industrial townships.
- Develop 16 new ports and modernize existing ports.
- Expand railway network by 25,000 km including high-speed rail corridors.
- Provide 24x7 electricity to all households by 2019.
- Establish optical fiber network in all 2.5 lakh gram panchayats.

HEALTH:
- Launch universal health assurance mission providing Rs 1 lakh coverage per family.
- Establish AIIMS-like institute in every state that does not have one.
- Increase healthcare spending to 2.5% of GDP from current 1.2%.
- Create 1 lakh new MBBS and 50,000 MD seats in medical colleges.
- Ensure 24x7 availability of 348 essential medicines at all public health facilities.
- Achieve zero preventable maternal and infant deaths by 2019.

EDUCATION:
- Increase education budget to 6% of GDP.
- Open 5 new IITs, 5 new IIMs, and 2 new AIIMS every year.
- Provide free and compulsory education to all children up to age 14.
- Skill 5 crore youth every year through National Skill Development Mission.
- Establish digital library providing free access to educational content in all languages.
- Ensure all government schools have toilets, drinking water, and electricity by 2016.

DEFENCE & SECURITY:
- Increase defence budget to 3% of GDP within 5 years.
- Achieve 70% indigenization of defence equipment by 2020.
- Modernize armed forces with latest technology and equipment.
- Establish National Security Doctrine to guide all security-related decisions.
- Strengthen border management with fencing and surveillance on all international borders.
- Create National Counter Terrorism Centre to coordinate intelligence agencies.

WOMEN EMPOWERMENT:
- Enact strict laws against crime against women with fast-track courts.
- Provide free education to girls up to graduation level.
- Reserve 33% of seats in central government jobs for women.
- Launch Beti Bachao Beti Padhao in all districts with skewed sex ratio.
- Establish working women hostels in all cities with population above 1 lakh.

SOCIAL WELFARE:
- Provide housing for all below poverty line families by 2022 — PM Awas Yojana.
- Ensure clean cooking fuel (LPG) to all BPL households under Ujjwala scheme.
- Give Rs 6000 per year income support to all small and marginal farmers.
- Implement Jan Dhan Yojana — bank account for every household.
- Provide Rs 2 lakh accidental insurance and Rs 2 lakh life insurance at Rs 12/year premium.`
  },

  // ══════════════════════════════════════════
  // BJP — LOK SABHA 2019
  // ══════════════════════════════════════════
  {
    partyAbbr: 'BJP',
    election: 'Lok Sabha 2019',
    year: 2019,
    electionType: 'Lok Sabha',
    summary: 'BJP 2019 manifesto "Sankalpit Bharat, Sashakt Bharat" focused on completing unfinished work and new vision for New India 2022.',
    text: `BJP Lok Sabha 2019 Manifesto — "Sankalpit Bharat, Sashakt Bharat"

NATION FIRST — SECURITY:
- Maintain zero tolerance policy against terrorism.
- Abrogate Article 370 to fully integrate Jammu & Kashmir with India.
- Implement National Register of Citizens (NRC) across all states.
- Strengthen surgical strike capability — will not hesitate to use force against terrorism.
- Build Ram Mandir in Ayodhya through constitutional means.

ECONOMY:
- Make India a $5 trillion economy by 2024-25.
- Create 75 lakh new enterprises under PM Mudra Yojana per year.
- Expand Jan Dhan-Aadhaar-Mobile (JAM) trinity to all government schemes.
- Provide 100% piped water connection to all rural households by 2024 — Jal Jeevan Mission.
- Achieve 450 GW renewable energy target by 2030.
- Make India a global manufacturing hub — attract $100 billion FDI per year.

AGRICULTURE:
- Double farmers income by 2022 through PM-KISAN and other schemes.
- Increase PM-KISAN annual income support from Rs 6000 to Rs 8000 per year.
- Achieve 100% crop insurance coverage under PM Fasal Bima Yojana.
- Establish 10,000 Farmer Producer Organizations across country.
- Create National Artificial Intelligence portal for agriculture — predict weather, pest attacks.
- Provide zero-interest loans up to Rs 1 lakh to all Kisan Credit Card holders.
- Ensure MSP at least 1.5 times cost of production for all 23 crops.

INFRASTRUCTURE:
- Complete Bharatmala — build 65,000 km national highways.
- Connect all 640 districts through rail, road, and air by 2024.
- Build 100 new airports under UDAN scheme for regional connectivity.
- Complete dedicated freight corridors — Eastern and Western.
- Lay 1.25 lakh km of road under PMGSY Phase-3.
- Expand Metro rail to 50 cities by 2024.
- Complete 175 GW renewable energy by 2022.

HEALTH:
- Expand Ayushman Bharat — provide Rs 5 lakh health cover to 50 crore people.
- Establish 1.5 lakh Health and Wellness Centres across country.
- Achieve TB-free India by 2025.
- Reduce maternal mortality rate to 100 per lakh live births by 2020.
- Reduce infant mortality rate to 28 per 1000 live births by 2024.
- Launch Mission Indradhanush 2.0 — universal vaccination of all children.

EDUCATION & YOUTH:
- Implement New Education Policy to transform school and higher education.
- Skill 1 crore youth per year under PM Kaushal Vikas Yojana.
- Provide scholarship to 5 lakh students from economically weaker sections.
- Set up National Sports Education Board — integrate sports in school curriculum.
- Create 1 crore startup opportunities through Startup India initiative.
- Open 50 new Kendriya Vidyalayas every year.

WOMEN & CHILDREN:
- Achieve 50% female literacy in districts below national average by 2024.
- Expand Ujjwala Yojana to provide LPG to all 8.5 crore BPL households.
- Provide free sanitary pads to all women in government schools and PHCs.
- Launch Poshan Abhiyan to eliminate malnutrition in children under 5 by 2022.
- Ensure 33% women reservation in Parliament and state legislatures.

TECHNOLOGY:
- Launch Digital India 2.0 — provide 1 Gbps broadband to all gram panchayats.
- Establish National Artificial Intelligence Mission with Rs 7500 crore investment.
- Create 50 lakh jobs in digital economy by 2024.
- Digitize all land records by 2021 under Digital India Land Records Modernisation Programme.

SOCIAL WELFARE:
- Build 1.95 crore houses under PM Awas Yojana (Urban) by 2022.
- Complete Open Defecation Free India — maintain and sustain Swachh Bharat.
- Provide Ayushman Bharat card to all 10 crore beneficiary families.
- Increase pension under PM Shram Yogi Maandhan to Rs 3000 per month for unorganized workers.`
  },

  // ══════════════════════════════════════════
  // BJP — LOK SABHA 2024
  // ══════════════════════════════════════════
  {
    partyAbbr: 'BJP',
    election: 'Lok Sabha 2024',
    year: 2024,
    electionType: 'Lok Sabha',
    summary: 'BJP 2024 manifesto "Modi Ki Guarantee" focused on Viksit Bharat 2047, infrastructure, welfare and making India 3rd largest economy.',
    text: `BJP Lok Sabha 2024 Manifesto — "Modi Ki Guarantee — Viksit Bharat"

VIKSIT BHARAT 2047:
- Make India the 3rd largest economy in the world by 2027.
- Achieve GDP of $5 trillion by 2026-27 and $7 trillion by 2030.
- Create 8 crore new jobs in manufacturing, services and digital economy.
- Make India a developed nation (Viksit Bharat) by 2047.

ECONOMY:
- Increase per capita income to Rs 4 lakh per month by 2047.
- Bring down income tax burden on middle class — restructure tax slabs.
- Set up 50 new industrial clusters in Tier 2 and Tier 3 cities.
- Achieve exports of $2 trillion by 2030.
- Launch Production Linked Incentive 2.0 for 25 more sectors.
- Establish 100 new Bharat Startup Hubs across the country.

AGRICULTURE:
- Increase PM-KISAN to Rs 9000 per year for all farmer families.
- Achieve 100% MSP procurement through digital mandis.
- Provide natural farming training to 1 crore farmers by 2025.
- Establish 2 lakh agri-infrastructure projects under PMKSY.
- Launch Kisan Drone scheme — provide drones to all FPOs.
- Achieve zero hunger in India by 2030 through food security measures.
- Give free fertilizers to small and marginal farmers holding up to 2 hectares.

INFRASTRUCTURE:
- Build 2 lakh km of new national highways by 2029.
- Complete 100 new airports including in all 50 lakh+ population cities.
- Expand metro rail network to 100 cities.
- Launch Amrit Bharat Train scheme — upgrade 1000 stations.
- Connect all northeast states through rail by 2025.
- Achieve 500 GW renewable energy by 2030.
- Provide 24x7 electricity to all households — zero power cut guarantee.

HEALTH:
- Expand Ayushman Bharat to cover all citizens above 70 years free of cost.
- Establish AIIMS in every state — complete remaining 16 AIIMS.
- Launch Mission Health 2047 — eliminate all preventable deaths.
- Provide free dialysis to all kidney patients at government hospitals.
- Achieve Universal Health Coverage for all 140 crore Indians by 2030.
- Build 2 lakh Ayushman Arogya Mandirs at village level.

EDUCATION:
- Implement National Education Policy 2020 fully by 2025.
- Open 1000 new Eklavya schools for tribal students.
- Provide free coaching for UPSC, JEE, NEET to economically weaker sections.
- Launch PM Vidyalakshmi scheme — education loan at zero interest for meritorious students.
- Digitize all 15 lakh government schools under PM e-Vidya 2.0.
- Skill 3 crore youth per year under Skill India Mission 2.0.

WOMEN:
- Reserve 33% seats for women in Parliament under Nari Shakti Vandan Act — implement fully.
- Launch Lakhpati Didi scheme — help 3 crore women earn Rs 1 lakh per year through SHGs.
- Provide free higher education to all girls up to graduation.
- Ensure 40% women in all central government recruitments.
- Give ownership rights to 1 crore rural women for agricultural land.

TECHNOLOGY & DIGITAL:
- Launch AI Mission India — invest Rs 10,000 crore in AI research and infrastructure.
- Connect all 6 lakh villages with 5G by 2026.
- Create 10 lakh cybersecurity professionals by 2027.
- Launch Digital Rupee for all government transactions by 2025.
- Establish 5 AI centres of excellence in IITs.

DEFENCE:
- Achieve 75% indigenization of defence equipment by 2027.
- Increase defence budget to 3% of GDP by 2026.
- Build world-class defence manufacturing corridor in UP and Tamil Nadu.
- Modernize all three armed forces with latest technology.

ENVIRONMENT:
- Plant 2.5 billion trees by 2030 under Green India Mission.
- Achieve net zero carbon emissions by 2070.
- Provide 1 crore rooftop solar connections under PM Surya Ghar Yojana.
- Ban single-use plastics completely by 2025.
- Clean all rivers including Ganga — achieve zero liquid discharge by 2026.`
  },

  // ══════════════════════════════════════════
  // INC — LOK SABHA 2014
  // ══════════════════════════════════════════
  {
    partyAbbr: 'INC',
    election: 'Lok Sabha 2014',
    year: 2014,
    electionType: 'Lok Sabha',
    summary: 'Congress 2014 manifesto focused on inclusive growth, food security, social welfare and rights-based approach.',
    text: `Indian National Congress Lok Sabha 2014 Manifesto — "Your Voice, Our Pledge"

ECONOMY & INCLUSIVE GROWTH:
- Maintain GDP growth rate above 8% through inclusive development model.
- Create 10 crore new jobs in next 5 years focusing on labour-intensive sectors.
- Implement Food Security Act — provide 5 kg grain per person per month at Rs 2-3.
- Increase minimum wage to Rs 200 per day for all unorganized sector workers.
- Establish National Investment and Manufacturing Zones for job creation.
- Reduce income inequality through progressive taxation and social spending.

AGRICULTURE:
- Implement comprehensive debt waiver for all small and marginal farmers.
- Increase agricultural credit to Rs 10 lakh crore per year.
- Launch new crop insurance scheme covering all risks at minimal premium.
- Expand MNREGA to provide 150 days of employment per year instead of 100.
- Establish farmer cooperatives in every village for collective bargaining.
- Provide free drip irrigation equipment to all farmers with less than 5 acres.
- Launch national irrigation mission to bring 10 crore hectares under irrigation.

SOCIAL WELFARE & RIGHTS:
- Expand Right to Education to cover early childhood and secondary education.
- Implement Right to Healthcare — free treatment in all government hospitals.
- Launch Right to Homestead — provide land to all landless rural families.
- Strengthen MNREGA with Rs 40,000 crore additional allocation.
- Increase old age pension to Rs 1000 per month for all BPL citizens above 60.
- Provide Rs 1 lakh accident insurance to all MNREGA workers.
- Launch universal social security scheme for all unorganized workers.

EDUCATION:
- Increase education expenditure to 6% of GDP within 3 years.
- Establish 200 new universities and 20,000 new colleges by 2019.
- Provide scholarships to all SC/ST/OBC students for higher education.
- Launch mid-day meal programme for high school students.
- Open 5 new IITs, 7 new IIMs, 5 new NITs every year.
- Make vocational training compulsory in all schools from class 9.
- Digitize all school libraries by 2016.

HEALTH:
- Increase health budget to 3% of GDP.
- Establish community health centres in all blocks with specialist doctors.
- Launch universal immunization programme — 100% vaccination by 2016.
- Provide free generic medicines at all government hospitals.
- Open AIIMS in all states — commission 6 new AIIMS.
- Achieve zero maternal mortality and infant mortality by 2020.

WOMEN & MINORITIES:
- Reserve 33% seats for women in Parliament and state legislatures immediately.
- Establish fast-track courts in every district for crimes against women.
- Launch Nirbhaya Fund with Rs 1000 crore for women safety.
- Strengthen Minority Affairs Ministry — increase scholarship amounts by 50%.
- Establish Waqf board reforms to better manage minority community assets.
- Provide housing loans at 4% interest to minorities for home construction.

ENVIRONMENT:
- Achieve 20% renewable energy in total energy mix by 2020.
- Plant 1 billion trees by 2019 under National Afforestation Programme.
- Implement strict pollution controls — achieve clean air standards in all cities.
- Launch Rs 20,000 crore Ganga clean-up mission.

GOVERNANCE:
- Pass Lok Pal Bill with strong provisions and independent selection committee.
- Implement e-governance in all Central ministries within 2 years.
- Decentralize power — give more funds and functions to panchayats.
- Establish Citizens Charter for all government services with penalty for delay.`
  },

  // ══════════════════════════════════════════
  // INC — LOK SABHA 2019
  // ══════════════════════════════════════════
  {
    partyAbbr: 'INC',
    election: 'Lok Sabha 2019',
    year: 2019,
    electionType: 'Lok Sabha',
    summary: 'Congress 2019 manifesto "Ab Hoga Nyay" introduced NYAY scheme, farm loan waiver and 22 key promises.',
    text: `Indian National Congress Lok Sabha 2019 Manifesto — "Ab Hoga Nyay"

NYAY — MINIMUM INCOME GUARANTEE:
- Launch NYAY (Nyuntam Aay Yojana) — transfer Rs 72,000 per year (Rs 6000/month) to 5 crore poorest families.
- Total investment of Rs 3.6 lakh crore per year — largest transfer scheme in history.
- Identify beneficiaries through transparent income assessment.
- Direct bank transfer to women of the household.
- Review and expand scheme based on implementation experience.

AGRICULTURE — KISAN MANIFESTO:
- Waive all outstanding farm loans within 10 days of coming to power.
- Establish separate agriculture budget for farmers.
- Guarantee MSP at C2+50% formula for all 23 crops.
- Reduce electricity tariff for agriculture to Rs 1 per unit.
- Exempt all agricultural income from income tax permanently.
- Create dedicated agriculture export zones with zero duty.
- Provide crop insurance at zero premium for small farmers.
- Establish PM Kisan Aayog — independent body to set and monitor MSP.

EMPLOYMENT:
- Fill all 4 lakh vacancies in Central Government within 1 year.
- Create 10 lakh jobs in government sector in first year.
- Amend labour laws to make it easier for companies to hire and fire — increase formal employment.
- Launch Rozgar Budget — dedicated budget for employment generation.
- Provide unemployment allowance of Rs 3500/month to educated unemployed youth.
- Establish Employment Guarantee Act for urban workers like MNREGA for rural.

EDUCATION:
- Increase education spending to 6% of GDP immediately.
- Abolish non-statutory fees in government universities.
- Provide education loan up to Rs 10 lakh at zero interest for higher education.
- Regularize all contractual teachers within 6 months.
- Restore autonomy to universities — end government interference in academic matters.
- Launch National Apprenticeship Programme — 50 lakh apprenticeships per year.

HEALTH:
- Launch Right to Healthcare — make healthcare a fundamental right.
- Increase health budget to 3% of GDP.
- Pass Clinical Establishments Act — regulate private hospitals.
- Provide all essential medicines free in government hospitals.
- Establish community health resource centres in all 6.4 lakh villages.
- Achieve doctor-population ratio of 1:1000 by 2024.

WOMEN:
- Reserve 33% seats for women in Parliament — introduce bill in first session.
- Increase women police stations to at least 1 per district.
- Guarantee equal pay for equal work — pass Equal Remuneration Act.
- Establish crèche and childcare centres in all workplaces with 10+ employees.
- Increase maternity leave to 12 months with full pay.

SOCIAL JUSTICE:
- Increase reservation for SC/ST in proportion to population.
- Sub-categorize OBC reservation for most backward communities.
- Establish Caste Census to collect data on OBC population and economic status.
- Strengthen SC/ST Prevention of Atrocities Act.
- Reserve 10% seats in private sector for SC/ST/OBC through legislation.

GOVERNANCE & DEMOCRACY:
- Restore autonomy of institutions — CBI, RBI, Election Commission.
- Pass Data Protection Law to protect citizens' privacy.
- Establish Citizens' Rights Charter with legal enforceability.
- Reduce number of Central Acts from 1500 to 200 through consolidation.
- Repeal sedition law — colonial era provision incompatible with democracy.`
  },

  // ══════════════════════════════════════════
  // INC — LOK SABHA 2024
  // ══════════════════════════════════════════
  {
    partyAbbr: 'INC',
    election: 'Lok Sabha 2024',
    year: 2024,
    electionType: 'Lok Sabha',
    summary: 'Congress 2024 manifesto "Nyay Patra" with 25 guarantees focusing on jobs, equality, farmers and welfare.',
    text: `Indian National Congress Lok Sabha 2024 Manifesto — "Nyay Patra — 25 Guarantees"

YUVA NYAY — YOUTH JUSTICE:
- Provide apprenticeship of Rs 1 lakh per year to all diploma/degree holders for first job — 30 lakh positions.
- Fill all 30 lakh vacant Central and State government posts within 1 year.
- Conduct joint entrance exam for all Central government jobs — one exam, multiple jobs.
- Provide Rs 1 lakh interest-free education loan for all students doing higher education.
- Start right to internship — 1 year paid internship in top 500 companies.

NARI NYAY — WOMEN JUSTICE:
- Transfer Rs 1 lakh per year to the woman head of every poor household — Mahalakshmi scheme.
- Implement Women Reservation Act 2023 in next election — 33% seats immediately.
- Increase women in Central government jobs to 50% in Group C and D posts.
- Provide free LPG cylinder to all BPL women — 10 cylinders per year.
- Launch National Care Economy Policy — recognize and compensate unpaid care work.

KISAN NYAY — FARMER JUSTICE:
- Provide legal guarantee for MSP at C2+50% for all crops.
- Waive all farm loans up to Rs 2 lakh immediately on coming to power.
- Increase PM-KISAN to Rs 10,000 per year per farmer family.
- Provide free crop insurance with zero premium to all farmers.
- Launch Debt Relief Commission for farmers with chronic debt.
- Guarantee minimum price for vegetables and fruits through price stabilization fund.

SHRAMIK NYAY — WORKER JUSTICE:
- Increase MNREGA wages to Rs 400 per day and expand to 200 days per year.
- Pass Urban Employment Guarantee Act — 100 days job guarantee in cities.
- Regularize all contract workers in Central government within 1 year.
- Increase minimum wage to Rs 400 per day for all workers.
- Provide Rs 500 monthly unemployment allowance through EPFO portal.
- Establish Social Security Fund for all gig workers — Ola, Swiggy, Zomato drivers.

HISSEDARI NYAY — PARTICIPATION JUSTICE:
- Conduct comprehensive Socio-Economic Caste Census within 1 year.
- Remove 50% cap on reservation — increase SC/ST/OBC reservation proportional to population.
- Establish Equality Commission to monitor and enforce equal opportunities.
- Provide reservation in private sector jobs — 25% for marginalized communities.
- Appoint SC/ST/OBC/minorities in constitutional bodies proportionally.

ECONOMY:
- Reduce GST on essential items — zero GST on all food items.
- Remove income tax on income up to Rs 5 lakh for salaried class.
- Bring wealth tax back on net worth above Rs 10 crore.
- Reduce corporate tax for MSMEs to 15%.
- Establish Public Sector Employment Bank — revive PSUs for job creation.

HEALTH:
- Expand health insurance to Rs 25 lakh per family.
- Make health a fundamental right — pass Right to Health Act.
- Reduce prices of all essential medicines by 50% through price controls.
- Open 50 new AIIMS and 500 new government medical colleges.
- Achieve Universal Health Coverage by 2030.

EDUCATION:
- Suspend National Education Policy 2020 — form new committee with teachers, experts.
- Increase education budget to 6% of GDP.
- Abolish all student fees in central universities.
- Restore Old Pension Scheme for all government employees.
- Increase teacher salaries by 25% — revise 7th Pay Commission.`
  },

  // ══════════════════════════════════════════
  // AAP — DELHI ASSEMBLY 2020
  // ══════════════════════════════════════════
  {
    partyAbbr: 'AAP',
    election: 'Delhi Assembly 2020',
    year: 2020,
    electionType: 'State Assembly',
    summary: 'AAP 2020 Delhi manifesto focused on free utilities, education revolution, mohalla clinics and women safety.',
    text: `Aam Aadmi Party Delhi Assembly 2020 Manifesto — "Kaam Ki Rajneeti"

ELECTRICITY:
- Provide 200 units of free electricity per month to all Delhi households — already delivered.
- Ensure 24x7 uninterrupted power supply throughout Delhi.
- Reduce power tariff for all slum dwellers to Rs 1 per unit.
- Install smart prepaid meters in all households by 2021.
- Set up 5000 MW solar capacity on rooftops across Delhi by 2025.
- Electricity bill will be zero for 90% households consuming under 200 units.

WATER:
- Provide 20,000 litres of free water per month to every household — already delivered.
- Ensure 24x7 piped water supply to all 300 unauthorized colonies.
- Install water ATMs in all areas not covered by piped water.
- Achieve zero water wastage — fix all leaking pipes within 6 months.
- Set up Yamuna rejuvenation project — make Yamuna clean by 2025.
- Free water to all jhuggis and slum areas without any restriction.

EDUCATION — EDUCATION REVOLUTION:
- Transform all 1000+ government schools into world-class institutions — already started.
- Send all government school principals to IIM/IIT for leadership training.
- Open 20 new schools of excellence — focus on sports, arts, sciences.
- Guarantee 100% pass percentage in Class 12 government schools.
- Provide free coaching for IIT-JEE, NEET, CLAT to all government school students.
- Launch entrepreneurship courses in all schools from class 9.
- Build swimming pools, football grounds in all government schools.

HEALTHCARE — MOHALLA CLINICS:
- Open 1000 Mohalla Clinics providing free OPD, medicines, tests near homes — 500 already open.
- Establish 30 Polyclinics — specialist doctors available near every neighborhood.
- Provide free surgery for 100+ diseases at government hospitals.
- Expand Jan Aushadhi stores — provide generic medicines at 50-90% lower prices.
- Make Delhi the medical tourism hub of Asia.
- Provide free ambulance within 10 minutes in any emergency anywhere in Delhi.

WOMEN SAFETY:
- Install 2.5 lakh CCTV cameras across Delhi — 1.5 lakh already installed.
- Provide free rides to women in DTC buses — already implemented.
- Deploy women marshals in all DTC buses.
- Open 24x7 helpline for women safety with 30-minute response guarantee.
- Install panic buttons in all autorickshaws and cabs.
- Launch self-defense training for all women in Delhi by 2021.

ECONOMY & EMPLOYMENT:
- Establish Delhi Entrepreneurship Mission — Rs 5000 crore fund for youth startups.
- Provide free Wi-Fi at 11,000 hotspots across Delhi — 4,000 already done.
- Open one-stop business facilitation centres — business registration in 1 day.
- Create 20 lakh new jobs through industrial clusters in Outer Delhi.
- Provide skill training to 5 lakh youth per year through Delhi Skill University.
- Launch e-auto scheme — 100% electric autos by 2025 with low-interest loans.

ENVIRONMENT:
- Make Delhi pollution-free — reduce AQI to below 100 by 2025.
- Plant 2 crore trees in Delhi by 2022.
- Convert entire DTC bus fleet to electric by 2025.
- Establish 500 CNG stations and 200 EV charging stations.
- Ban burning of garbage and construction waste through strict enforcement.
- Achieve 100% solid waste processing by 2022.

SENIOR CITIZENS:
- Provide free pilgrimage to all senior citizens — Mukhyamantri Teerth Yatra Yojana.
- Increase old age pension to Rs 2500 per month.
- Establish 50 new old age homes with world-class facilities.
- Free healthcare for all senior citizens at government hospitals.

INFRASTRUCTURE:
- Complete construction of 50 flyovers and underpasses in congested areas.
- Build 1000 km of footpaths and cycling tracks across Delhi.
- Open 10 new bus depots and increase DTC fleet to 10,000 buses.
- Establish night shelters for all homeless — zero homeless in Delhi by 2022.`
  },

  // ══════════════════════════════════════════
  // AAP — PUNJAB ASSEMBLY 2022
  // ══════════════════════════════════════════
  {
    partyAbbr: 'AAP',
    election: 'Punjab Assembly 2022',
    year: 2022,
    electionType: 'State Assembly',
    summary: 'AAP Punjab 2022 manifesto promising free electricity, anti-corruption, employment and healthcare revolution.',
    text: `Aam Aadmi Party Punjab Assembly 2022 Manifesto

ELECTRICITY:
- Provide 300 units of free electricity per month to every household in Punjab.
- Ensure 24x7 uninterrupted electricity to farmers for agriculture.
- Reduce commercial electricity rates to boost business.
- Install smart meters to eliminate fake billing.
- Cancel all pending electricity bills up to Rs 2 lakh for BPL families.

EMPLOYMENT:
- Provide government job to one member of every unemployed family.
- Open 16 government medical colleges — 1 per district — creating 10,000 doctor jobs.
- Establish IT hub in Punjab — bring 1 lakh IT jobs to Punjab by 2025.
- Give Rs 3000 monthly unemployment allowance to all educated unemployed youth.
- Open 5 new universities and 50 colleges in rural areas.

AGRICULTURE:
- Waive all pending electricity bills of farmers immediately.
- Provide MSP to all crops — not just wheat and rice.
- Open procurement centres in every village — farmer does not need to go to mandi.
- Give Rs 5500 per acre bonus to farmers growing non-paddy crops.
- Establish cold storage chains in all districts to prevent post-harvest loss.
- Provide free quality seeds and fertilizers to small farmers.
- Create 10,000 vermi-compost units to encourage natural farming.

HEALTH:
- Establish Mohalla Clinics in every ward and village — 16,000 clinics total.
- Provide free medicines, tests and OPD at all government hospitals.
- Open AIIMS-level hospital in every district — 22 new hospitals.
- Free dialysis for all kidney patients at government hospitals.
- Mobile health vans in all 12,000 villages every week.

ANTI-CORRUPTION:
- Establish anti-corruption helpline — no bribe to any government official.
- E-governance for all services — ration card, driving licence, birth certificate online.
- Video audit of all government works — live streaming of construction projects.
- End drug mafia — 100% elimination of drug trade in 4 years.
- Seize assets of all drug traffickers and use proceeds for rehabilitation.
- Transfer all police postings through online transparent system — end political transfers.

WOMEN:
- Give Rs 1000 per month to every woman above 18 in Punjab.
- Reserve 50% government jobs for women.
- Free education for girls up to graduation.
- Establish women police stations in every subdivision.

INDUSTRY:
- Set up industrial corridors in Amritsar, Ludhiana, Jalandhar regions.
- Provide single window clearance for all business approvals in 7 days.
- Reduce VAT on industrial goods to boost manufacturing.
- Attract Rs 1 lakh crore investment in Punjab in 5 years.`
  },

  // ══════════════════════════════════════════
  // SP — UP ASSEMBLY 2022
  // ══════════════════════════════════════════
  {
    partyAbbr: 'SP',
    election: 'UP Assembly 2022',
    year: 2022,
    electionType: 'State Assembly',
    summary: 'SP 2022 UP manifesto focusing on unemployment allowance, free tablets, farmer welfare and social justice.',
    text: `Samajwadi Party UP Assembly 2022 Manifesto — "Kaam Bolta Hai"

EMPLOYMENT & YOUTH:
- Provide Rs 1500 monthly unemployment allowance to all educated unemployed youth.
- Fill all 7 lakh vacant government posts within 1 year.
- Establish recruitment board free from political interference.
- Provide free tablet and smartphone to all students passing class 10 and 12.
- Open SP government polytechnics in every district.
- Give Rs 30,000 grant to all girls who pass Class 12 examination.
- Launch Samajwadi Kaushal Mission — skill 5 lakh youth per year.

AGRICULTURE:
- Provide Rs 25 lakh compensation to families of all farmers who died in protests.
- Waive all pending electricity bills of farmers immediately.
- Ensure MSP at C2+50% for all crops — legal guarantee.
- Give 300 units free electricity per month to all households.
- Establish new agricultural universities in Bundelkhand and Purvanchal.
- Provide free irrigation water to small and marginal farmers.
- Give Rs 5000 per quintal for sugarcane — increase from current SAP.

SOCIAL WELFARE:
- Provide Rs 15 lakh house to all homeless families.
- Increase old age pension to Rs 3000 per month.
- Give Rs 25,000 marriage grant to daughters of poor families.
- Provide free ration — 10 kg grain per family per month.
- Establish SP hospitals in every district with free treatment.
- Give Rs 1 lakh to families of all workers who died during COVID.

WOMEN SAFETY:
- Establish anti-Romeo squads in every district with women officers.
- Install CCTV cameras in all cities and towns.
- Open women police stations in every block.
- Provide free legal aid to all rape and crime victims.
- Launch 1090 helpline 24x7 — response within 15 minutes guaranteed.

MINORITIES & SOCIAL JUSTICE:
- Give 18% reservation to OBCs in government jobs — implement Supreme Court verdict.
- Reserve 5% government jobs for minorities.
- Establish Samajwadi Rozgar Kendra in every block for minority youth.
- Provide Rs 10,000 start-up grant to minority artisans and weavers.
- Restore Azaan on mosques — ensure religious freedom for all.

INFRASTRUCTURE:
- Build Agra-Lucknow Expressway extension to Varanasi.
- Establish metro rail in Agra, Meerut, Kanpur.
- Build 500 new government hospitals across UP.
- Open universities in every district — increase seats in existing ones.
- Complete Ganga Expressway in time-bound manner.`
  },

  // ══════════════════════════════════════════
  // BSP — LOK SABHA 2019
  // ══════════════════════════════════════════
  {
    partyAbbr: 'BSP',
    election: 'Lok Sabha 2019',
    year: 2019,
    electionType: 'Lok Sabha',
    summary: 'BSP 2019 manifesto focused on Dalit rights, SC/ST reservation, economic equality and social justice.',
    text: `Bahujan Samaj Party Lok Sabha 2019 Manifesto — "Sarvajan Hitay, Sarvajan Sukhay"

RESERVATION & SOCIAL JUSTICE:
- Restore SC/ST reservation in promotion in government jobs — amend Constitution if needed.
- Implement 10% reservation for economically weaker sections separately — not from SC/ST quota.
- Sub-categorize OBC reservation — give proportional share to most backward OBCs.
- Extend reservation to private sector — 25% jobs for SC/ST/OBC in private companies.
- Establish National Commission for Dalits with constitutional status.
- Increase reservation in educational institutions from 49% to proportional population share.
- Ensure reservation in judiciary — Dalit/OBC/Minority judges in High Courts and Supreme Court.

SC/ST WELFARE:
- Increase SC/ST sub-plan fund to proportional to population (22% budget).
- Transfer SC/ST Sub-Plan funds directly to beneficiaries — end diversion.
- Give land rights to all landless Dalit families — 5 acres per family.
- Establish SC/ST Development Corporation with Rs 50,000 crore corpus.
- Provide free housing to all landless SC/ST families under own scheme separate from PMAY.
- Establish 500 Dr. Ambedkar Hostels for SC/ST students in cities.

MINORITIES:
- Implement Sachar Committee recommendations — provide proportional jobs to Muslims.
- Establish Minority Development Bank with Rs 10,000 crore corpus.
- Reserve 15% of all government jobs for minorities proportional to population.
- Restore Minority Scholarship Programme — increase amounts by 3x.
- Protect Waqf properties — strengthen Waqf Board with independent powers.

ECONOMY:
- Increase minimum wage to Rs 500 per day nationally.
- Strengthen MNREGA — increase wages to Rs 500/day and 200 days guarantee.
- Waive all agricultural loans below Rs 5 lakh immediately.
- Provide MSP at 50% above C2 cost for all agricultural produce.
- Give Rs 75,000 annual income support to all BPL families through direct transfer.

WOMEN:
- Pass 33% reservation bill for women in Parliament in first session.
- Strengthen Domestic Violence Act — fast-track courts in every district.
- Give property rights to women on par with men through law amendment.
- Establish 24-hour women safety helpline with 10-minute response guarantee.

GOVERNANCE:
- Restore functioning autonomy of CBI, CVC, Election Commission.
- Amend RTI Act to make it more effective — no exemptions for political parties.
- Bring all constitutional amendments through 2/3 majority and state ratification.
- Establish People's Lokpal with representatives from marginalized communities.
- Make caste discrimination in private sector a criminal offence.

HEALTH & EDUCATION:
- Increase healthcare budget to 5% of GDP — focus on SC/ST/OBC areas.
- Open Ambedkar Medical Colleges in all states — 100% seats reserved for SC/ST.
- Increase education budget to 10% of GDP.
- Provide free coaching for UPSC, state services to all SC/ST/OBC candidates.
- Establish Dr. Ambedkar Universities in all states with free education for Dalits.`
  },

  // ══════════════════════════════════════════
  // BJP — UP ASSEMBLY 2022
  // ══════════════════════════════════════════
  {
    partyAbbr: 'BJP',
    election: 'UP Assembly 2022',
    year: 2022,
    electionType: 'State Assembly',
    summary: 'BJP UP 2022 manifesto focused on law and order, development, free ration and welfare schemes continuation.',
    text: `BJP UP Assembly 2022 Manifesto — "Lok Kalyan Sankalp Patra"

LAW & ORDER:
- Maintain zero tolerance against crime — continue anti-mafia operations.
- Install CCTV cameras in all cities and towns across UP.
- Build 75 new police stations — one in every district.
- Establish women anti-crime helpline 1090 — response in 20 minutes.
- Launch Operation Conviction — ensure 90% conviction rate in heinous crimes.
- Establish anti-corruption bureau in every division.

DEVELOPMENT:
- Complete Purvanchal Expressway and Bundelkhand Expressway.
- Establish Defence Industrial Corridor — bring Rs 50,000 crore investment.
- Open data centres and IT parks in Lucknow, Noida, Agra.
- Attract Rs 10 lakh crore investment in 5 years — double from last term.
- Complete metro expansion in Lucknow, Kanpur, Agra, Meerut, Prayagraj.
- Build 25,000 km of new roads across UP under state highway programme.

AGRICULTURE:
- Continue free power supply to farmers — no increase in agriculture tariff.
- Establish new mandis in 200 blocks where no mandi exists.
- Provide PM Kisan at Rs 6000 per year to all eligible farmers.
- Launch Kisan Samriddhi Yojana — Rs 3000 additional support to natural farming adopters.
- Complete all irrigation projects — bring 100% agricultural land under irrigation by 2025.
- Open 500 cold storage units in rural areas for vegetable and fruit farmers.

FREE RATION & WELFARE:
- Continue free ration to 15 crore people — 5 kg wheat/rice per person per month.
- Provide free housing to 40 lakh more families under PMAY-G.
- Give free LPG connections to all remaining BPL households — Ujjwala 2.0.
- Increase old age pension to Rs 1500 per month.
- Free electricity 100 units per month to all BPL households.
- Give Rs 30,000 marriage grant to daughters of BPL families under Kanya Sumangala.

EDUCATION:
- Transform 1000 government schools into smart schools.
- Open 100 new Atal Residential Schools for talent in rural areas.
- Provide free tablets to all students in government colleges.
- Increase teacher recruitment — fill 1.5 lakh teacher vacancies in 1 year.
- Open 5 new medical colleges in underserved regions.
- Establish Sports University in Meerut — develop Olympic-level athletes from UP.

HEALTH:
- Open 50 new district hospitals with 200-bed capacity.
- Establish Jan Aushadhi Kendras in all blocks — medicines at 50-90% discount.
- Provide Ayushman card to all families not currently covered.
- Build 5000 new Health and Wellness Centres in rural UP.
- Achieve zero infant mortality in UP by 2025.
- Free dialysis for all kidney patients at all district hospitals.

WOMEN EMPOWERMENT:
- Increase women in police force to 25% — recruit 50,000 women constables.
- Provide Rs 1 lakh self-employment loan to 5 lakh women annually.
- Establish Mahila Shakti Kendras in every block.
- Give free bicycle to all girls studying in class 9 government schools.
- Launch Mission Shakti — ensure safety and dignity of all women in UP.`
  },

];


async function seedManifestos() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  let added = 0, skipped = 0;

  for (const m of manifestoData) {
    // Find party
    const party = await Party.findOne({ abbreviation: m.partyAbbr });
    if (!party) {
      console.log(`⚠️  Party ${m.partyAbbr} not found — run seed.js first`);
      skipped++;
      continue;
    }

    // Skip if already exists
    const exists = await Manifesto.findOne({ party: party._id, election: m.election });
    if (exists) {
      console.log(`⏭️  Already exists: ${m.partyAbbr} — ${m.election}`);
      skipped++;
      continue;
    }

    
    console.log(`🔄 Processing: ${m.partyAbbr} — ${m.election}`);
    const chunks = ragService.chunkText(m.text);
    const embeddedChunks = await ragService.embedChunks(chunks);

   
    const categoryKeywords = {
      'Agriculture': ['farmer', 'kisan', 'crop', 'agriculture', 'msp', 'irrigation'],
      'Economy': ['gdp', 'economy', 'growth', 'employment', 'job', 'investment'],
      'Education': ['education', 'school', 'university', 'student', 'scholarship'],
      'Health': ['health', 'hospital', 'medical', 'doctor', 'ayushman'],
      'Infrastructure': ['road', 'highway', 'railway', 'airport', 'metro'],
      'Social Welfare': ['welfare', 'pension', 'subsidy', 'bpl', 'poor'],
      'Women': ['women', 'girl', 'mahila', 'nari'],
      'Governance': ['governance', 'corruption', 'transparent', 'digital'],
      'Defence': ['defence', 'military', 'security', 'border'],
      'Environment': ['environment', 'solar', 'renewable', 'pollution', 'tree'],
    };
    const lower = m.text.toLowerCase();
    const categories = Object.entries(categoryKeywords)
      .filter(([, kws]) => kws.some(kw => lower.includes(kw)))
      .map(([cat]) => cat);

    await Manifesto.create({
      party: party._id,
      election: m.election,
      year: m.year,
      electionType: m.electionType,
      rawText: m.text,
      summary: m.summary,
      categories,
      chunks: embeddedChunks,
      status: 'indexed',
    });

    console.log(`✅ Added: ${m.partyAbbr} — ${m.election} (${chunks.length} chunks)`);
    added++;
  }

  console.log(`\n🎉 Done! Added: ${added}, Skipped: ${skipped}`);
  console.log('All manifestos are now indexed and ready for RAG queries!');
  mongoose.disconnect();
}

seedManifestos().catch(e => { console.error('❌ Error:', e.message); mongoose.disconnect(); });
