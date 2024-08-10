fetch(
  "https://raw.githubusercontent.com/voidrlm/Adblock-Browser-Extension/main/custom_rules/voidrlm_block_list.txt"
)
  .then((response) => response.text())
  .then((text) => {
    const urlFilters = text
      .split("\n")
      .filter((line) => line && !line.startsWith("!") && !line.startsWith("["))
      .map((line) => line.trim());

    const rules = urlFilters.map((filter, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: filter },
    }));

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: rules.map((rule) => rule.id),
    });
    console.log(rules);
  })
  .catch((error) => console.error("Error fetching adblock list:", error));
