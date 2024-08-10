const urls = [
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_adservers.txt",
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_thirdparty_popup.txt",
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_adservers_popup.txt",
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_thirdparty.txt",
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/adult_adservers.txt",
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/adult_adservers_popup.txt",
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/adult_thirdparty.txt",
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/adult_thirdparty_popup.txt",
];

async function fetchAndCombineRules() {
  try {
    const responses = await Promise.all(urls.map((url) => fetch(url)));
    const texts = await Promise.all(
      responses.map((response) => response.text())
    );

    const urlFilters = texts
      .join("\n")
      .split("\n")
      .filter((line) => line && !line.startsWith("!") && !line.startsWith("["))
      .map((line) => line.trim());

    const rules = urlFilters.map((filter, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: filter },
    }));

    // Update rules in chunks
    updateRulesInChunks(rules);
  } catch (error) {
    console.error("Error fetching adblock lists:", error);
  }
}
