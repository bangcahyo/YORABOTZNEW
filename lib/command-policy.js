function getCommandPolicy(command, plugins, getLimitCost, noLimitCommands, isPremiumCommand) {
  const plugin = plugins.get(command);
  const canonicalCommand = plugin ? plugin.name.toLowerCase() : command;
  const limitCost = getLimitCost(canonicalCommand);
  const isFree = !plugin ||
    noLimitCommands.includes(command) ||
    noLimitCommands.includes(canonicalCommand) ||
    limitCost <= 0 ||
    plugin.category === 'game' ||
    plugin.category === 'fun';

  return {
    plugin,
    canonicalCommand,
    limitCost,
    isFree,
    isPremiumOnly: isPremiumCommand(canonicalCommand),
  };
}

module.exports = { getCommandPolicy };
