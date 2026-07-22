const API_KEY = "YOUR_GROQ_API_KEY";
const events = [
    "❌ Failed SSH Login from 192.168.1.14",
    "⚠ PowerShell executed with admin rights",
    "⚠ Malware signature detected",
    "✔ User logged in successfully",
    "⚠ Multiple failed login attempts",
    "❌ Suspicious outbound traffic",
    "⚠ Unusual file encryption detected",
    "✔ Firewall updated successfully"
];

const logBox = document.getElementById("logs");
const report = document.getElementById("report");
const analyzeBtn = document.getElementById("analyzeBtn");

function addLog() {
    const random = events[Math.floor(Math.random() * events.length)];
    const time = new Date().toLocaleTimeString();

    const p = document.createElement("p");
    p.textContent = `${time} - ${random}`;

    logBox.prepend(p);

    if (logBox.children.length > 8) {
        logBox.removeChild(logBox.lastChild);
    }
}

setInterval(addLog, 1500);
addLog();

analyzeBtn.addEventListener("click", analyzeThreat);

async function analyzeThreat() {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";

    const logs = Array.from(logBox.children)
        .map(p => p.textContent)
        .join("\n");

const prompt = `
You are SentinelAI, an AI Security Operations Center (SOC) analyst.

Analyze the following security logs.

Respond ONLY in HTML using this exact format:

<h3>Threat Summary</h3>
<p>...</p>

<h3>Severity</h3>
<p>...</p>

<h3>Likely Attack</h3>
<p>...</p>

<h3>MITRE ATT&CK</h3>
<p>Technique ID and Name</p>

<h3>Recommended Actions</h3>
<ul>
<li>...</li>
<li>...</li>
<li>...</li>
</ul>

<h3>Executive Incident Report</h3>
<p>...</p>

Security Logs:

${logs}
Assume these logs belong to a critical national infrastructure organization such as a power grid, government agency, or water treatment facility.

Keep the response under 200 words.

Be concise, professional, and enterprise-grade.

Mention the most likely MITRE ATT&CK technique if applicable.
`;

    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "system",
                            content: "You are an expert SOC cybersecurity analyst."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.3
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            report.textContent = JSON.stringify(data, null, 2);
            return;
        }

        report.innerHTML = data.choices[0].message.content
            .replace(/\n/g, "<br>")
            .replace(/## (.*?)(<br>|$)/g, "<h3>$1</h3>");

    } catch (err) {
        report.textContent = "Error connecting to Groq API.";
        console.error(err);
    }

    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "Analyze Threat";
}
const threatLevel = document.getElementById("threatLevel");
const riskScore = document.getElementById("riskScore");

function updateThreat() {

    const score = Math.floor(Math.random() * 41) + 60;

    riskScore.textContent = score + "%";

    if (score >= 90) {
        threatLevel.innerHTML = "HIGH 🔴";
        threatLevel.style.color = "red";
    }
    else if (score >= 75) {
        threatLevel.innerHTML = "MEDIUM 🟡";
        threatLevel.style.color = "orange";
    }
    else {
        threatLevel.innerHTML = "LOW 🟢";
        threatLevel.style.color = "lime";
    }

}

setInterval(updateThreat, 3000);
updateThreat();
const techniques = [
    {
        id: "T1110",
        name: "Brute Force"
    },
    {
        id: "T1059",
        name: "Command and Scripting Interpreter"
    },
    {
        id: "T1078",
        name: "Valid Accounts"
    },
    {
        id: "T1486",
        name: "Data Encrypted for Impact"
    }
];

function updateMITRE(){

    const t = techniques[Math.floor(Math.random()*techniques.length)];

    document.getElementById("mitreId").textContent = t.id;

    document.getElementById("mitreName").textContent = t.name;

    document.getElementById("confidence").textContent =
        "Confidence: " + (80 + Math.floor(Math.random()*20)) + "%";

}

setInterval(updateMITRE,4000);

updateMITRE();