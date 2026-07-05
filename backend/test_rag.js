const ragService = require('./services/ragService');

const text = "Communist Party of India (Marxist) — 2024 The Communist Party of India (Marxist) has released its election manifesto for the 18th Lok Sabha elections, outlining its vision for a secular, democratic, and sovereign India. The party identifies the current BJP government as a threat to India's constitutional principles, citing its attempts to dismantle the pillars of secular democracy, economic sovereignty, federalism, and social justice. The manifesto argues that the BJP's rule has led to increased inequality, communal polarization, and erosion of democratic institutions. The CPI(M) places strong emphasis on defending secularism and democracy, pledging to fight against the BJP's attempts to promote a Hindutva ideology and undermine the principles of secularism. The party condemns the Citizenship Amendment Act (CAA) and the National Register of Citizens (NRC), which it sees as discriminatory and divisive. It also vows to defend the rights of minority communities, including Muslims and Christians, who have faced increased attacks and violence under the BJP rule. The CPI(M) promises to scrap the CAA and enact laws against hate speech and crimes. The party also focuses on defending economic sovereignty, arguing that the BJP government has promoted crony capitalism and the loot of national assets. The CPI(M) criticizes the government's policies of privatization, deregulation, and corporatization, which it believes have widened economic inequalities and undermined India's self-reliance. The party pledges to protect India's public sector, natural wealth, and the rights of labor forces and farmers. It also promises to implement policies that promote economic growth, employment, and social welfare, rather than relying on foreign investment and corporate interests. The CPI(M) targets various demographics, including the working class, farmers, and minority communities, who have been disproportionately affected by the BJP's policies. The party seeks to appeal to these groups by promising to defend their rights, promote social justice, and ensure economic sovereignty. Overall, the CPI(M) manifesto presents a vision for a more equitable, secular, and democratic India, and calls on citizens to join the party in its efforts to defeat the BJP and establish a secular government at the centre.";
console.log("Original text length:", text.length);

const chunks = ragService.chunkText(text);
console.log("Chunks count:", chunks.length);
if (chunks.length > 0) {
    console.log("First chunk:", chunks[0]);
}

ragService.embedChunks(chunks).then(embedded => {
    console.log("Embedded chunks count:", embedded.length);
    if (embedded.length > 0) {
        console.log("First embedded chunk embedding length:", embedded[0].embedding.length);
    }
});
