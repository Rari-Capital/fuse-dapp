// Unpackage imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const EvmChains = window.EvmChains;
const Fortmatic = window.Fortmatic;
const Torus = window.Torus;
const Portis = window.Portis;
const Authereum = window.Authereum;

// Enable Big.toFormat and set rounding mode to round down
toFormat(Big);
Big.RM = 0;

App = {
  web3: null,
  web3Modal: null,
  web3Provider: null,
  accounts: [],
  selectedAccount: null,
  fuse: null,
  comptrollerAbi: null,
  cEtherAbi: null,
  cErc20Abi: null,
  erc20Abi: null,

  init: function() {
    if (location.hash === "#deploy") {
      $('#page-pools').hide();
      $('#page-pool').hide();
      $('#page-deploy').show();
      $('#tab-pools').css('text-decoration', '');
      $('#tab-deploy').css('text-decoration', 'underline');
    }

    $('#tab-pools').click(function() {
      $('#page-pool, #page-deploy, #page-liquidations').hide();
      $('#page-pools').show();
      $('#tab-deploy, #tab-liquidations').css('text-decoration', '');
      $('#tab-pools').css('text-decoration', 'underline');
    });

    $('#tab-deploy').click(function() {
      $('#page-pools, #page-pool, #page-liquidations').hide();
      $('#page-deploy').show();
      $('#tab-pools, #tab-liquidations').css('text-decoration', '');
      $('#tab-deploy').css('text-decoration', 'underline');
    });

    $('#tab-liquidations').click(function() {
      $('#page-pools, #page-pool, #page-deploy').hide();
      $('#page-liquidations').show();
      $('#tab-pools, #tab-deploy').css('text-decoration', '');
      $('#tab-liquidations').css('text-decoration', 'underline');
    });

    App.initChartColors();
    App.initWeb3();
    App.bindEvents();
  },

  initChartColors: function() {
    Chart.defaults.global.defaultFontColor = "#999";
    window.chartColors = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)'
    };
  },

  /**
   * Initialize Web3Modal.
   */
  initWeb3Modal: function() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "c52a3970da0a47978bee0fe7988b67b6"
        }
      },
  
      fortmatic: {
        package: Fortmatic,
        options: {
          key: "pk_live_A5F3924825DC427D"
        }
      },

      torus: {
        package: Torus,
        options: {}
      },

      portis: {
        package: Portis,
        options: {
          id: "1fd446cc-629b-46bc-a50c-6b7fe9251f05"
        }
      },

      authereum: {
        package: Authereum,
        options: {}
      }
    };
  
    App.web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      providerOptions, // required
    });
  },

  /**
   * Kick in the UI action after Web3modal dialog has chosen a provider
   */
  fetchAccountData: async function() {
    // Get a Web3 instance for the wallet
    App.web3 = new Web3(App.web3Provider);

    // Get connected chain ID from Ethereum node
    const chainId = await App.web3.eth.getChainId();

    /* if (chainId !== 1) {
      $('#depositButton, #withdrawButton, #transferButton').prop("disabled", true);
      toastr["error"]("Invalid chain selected.", "Ethereum connection failed");
    } */
  
    // Get list of accounts of the connected wallet
    // MetaMask does not give you all accounts, only the selected account
    App.accounts = await App.web3.eth.getAccounts();
    App.selectedAccount = App.accounts[0];

    // Mixpanel
    if (typeof mixpanel !== 'undefined') {
      mixpanel.identify(App.selectedAccount);
      mixpanel.people.set({
        "Ethereum Address": App.selectedAccount,
        "App Version": "0.1.0"
      });
    }

    // Get user's account balance in the stablecoin fund, RFT balance, and account balance limit
    // TODO: Below
    App.getMyFusePools();
    if (!App.intervalGetMyFusePools) App.intervalGetMyFusePools = setInterval(App.getMyFusePools, 5 * 60 * 1000);

    // Load acounts dropdown
    $('#selected-account').empty();
    for (var i = 0; i < App.accounts.length; i++) $('#selected-account').append('<option' + (i == 0 ? ' selected' : '') + '>' + App.accounts[i] + '</option>');
  
    // Display fully loaded UI for wallet data
    $('#deployPoolButton, #deployAssetButton').prop("disabled", false);
  },
  
  /**
   * Fetch account data for UI when
   * - User switches accounts in wallet
   * - User switches networks in wallet
   * - User connects wallet initially
   */
  refreshAccountData: async function() {
    // If any current data is displayed when
    // the user is switching acounts in the wallet
    // immediate hide this data
    $('.pools-table-private tbody').html('<tr colspan="7">Loading my Fuse pools...</td>');
    $('#DeployAssetPool').html('<option selected disabled>Loading pools...</option>');
  
    // Disable button while UI is loading.
    // fetchAccountData() will take a while as it communicates
    // with Ethereum node via JSON-RPC and loads chain data
    // over an API call.
    $(".btn-connect").text("Loading...");
    $(".btn-connect").prop("disabled", true);
    await App.fetchAccountData();
    $(".btn-connect").hide();
    $(".btn-connect").text("Connect Wallet");
    $(".btn-connect").prop("disabled", false);
    $("#btn-disconnect").show();
    $('.show-account').show();
  },
  
  /**
   * Connect wallet button pressed.
   */
  connectWallet: async function() {
    // Setting this null forces to show the dialogue every time
    // regardless if we play around with a cacheProvider settings
    // in our localhost.
    // TODO: A clean API needed here
    App.web3Modal.providerController.cachedProvider = null;
  
    try {
      App.web3Provider = await App.web3Modal.connect();
    } catch(e) {
      console.error("Could not get a wallet connection", e);
      return;
    }

    App.fuse = new Fuse(App.web3Provider);

    if (App.web3Provider.on) {
      // Subscribe to accounts change
      App.web3Provider.on("accountsChanged", (accounts) => {
        App.fetchAccountData();
      });
    
      // Subscribe to chainId change
      App.web3Provider.on("chainChanged", (chainId) => {
        App.fetchAccountData();
      });
    
      // Subscribe to networkId change
      App.web3Provider.on("networkChanged", (networkId) => {
        App.fetchAccountData();
      });
    }
  
    await App.refreshAccountData();
  },
  
  /**
   * Disconnect wallet button pressed.
   */
  disconnectWallet: async function() {
    console.log("Killing the wallet connection", App.web3Provider);
  
    // TODO: MetamaskInpageProvider does not provide disconnect?
    if (App.web3Provider.close) {
      await App.web3Provider.close();
      App.web3Provider = null;
    }
  
    App.selectedAccount = null;
  
    // Set the UI back to the initial state
    $("#selected-account").html('<option disabled selected>Please connect your wallet...</option>');
    $('.show-account').hide();
    $("#btn-disconnect").hide();
    $(".btn-connect").show();
    $('.pools-table-private tbody').html('<tr colspan="7">Wallet not connected.</td>');
  },
  
  /**
   * Initialize the latest version of web3.js (MetaMask uses an oudated one that overwrites ours if we include it as an HTML tag), then initialize and connect Web3Modal.
   */
  initWeb3: function() {
    $.getScript("js/web3.min.js", function() {
      if (typeof window.ethereum !== 'undefined') {
        App.web3 = new Web3(window.ethereum);
      } else if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
        App.web3 = new Web3(window.web3.currentProvider);
      } else {
        App.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/c52a3970da0a47978bee0fe7988b67b6"));
      }
  
      App.fuse = new Fuse(App.web3.currentProvider);
      App.initContracts();
      App.initWeb3Modal();
    });
  },
  
  /**
   * Initialize FundManager and FundToken contracts.
   */
  initContracts: function() {
    App.getFusePools();
    setInterval(App.getFusePools, 5 * 60 * 1000);

    App.comptrollerAbi = JSON.parse(App.fuse.compoundContracts["contracts/Comptroller.sol:Comptroller"].abi);
    App.cErc20Abi = JSON.parse(App.fuse.compoundContracts["contracts/CErc20Delegator.sol:CErc20Delegator"].abi);
    App.cEtherAbi = JSON.parse(App.fuse.compoundContracts["contracts/CEtherDelegator.sol:CEtherDelegator"].abi);
    App.erc20Abi = JSON.parse(App.fuse.compoundContracts["contracts/EIP20Interface.sol:EIP20Interface"].abi);
  },
  
  /**
   * Bind button click events.
   */
  bindEvents: function() {
    $(document).on('click', '.btn-connect', App.connectWallet);
    $(document).on('click', '#btn-disconnect', App.disconnectWallet);

    $(document).on('change', '#selected-account', function() {
      // Set selected account
      App.selectedAccount = $(this).val();

      // Mixpanel
      if (typeof mixpanel !== 'undefined') {
        mixpanel.identify(App.selectedAccount);
        mixpanel.people.set({
          "Ethereum Address": App.selectedAccount,
          "App Version": "0.1.0"
        });
      }

      // Get user's Fuse pools
      App.getMyFusePools();
    });

    $(document).on('change', '#DeployAssetPool, #DeployAssetUnderlying', async function() {
      if ($('#DeployAssetPool').val() && $('#DeployAssetUnderlying').val().length > 0) {
        var token = new App.web3.eth.Contract(App.erc20Abi, $('#DeployAssetUnderlying').val());

        try {
          var symbol = await token.methods.symbol().call();
        } catch (error) {
          return;
        }

        $('#DeployAssetName').val($('#DeployAssetPool option:selected').text() + " " + symbol)
        $('#DeployAssetSymbol').val("f" + symbol);
      }
    });

    $(document).on('change', '#DeployPoolPriceOracle', function() {
      $('#DeployPoolPriceOracle').val() && $('#DeployPoolPriceOracle').val().length > 0 ? $('#DeployPoolPriceOracleOtherWrapper').hide() : $('#DeployPoolPriceOracleOtherWrapper').show();
    });

    $(document).on('change', '#DeployAssetInterestRateModel', function() {
      $('#DeployAssetInterestRateModel').val() && $('#DeployAssetInterestRateModel').val().length > 0 ? $('#DeployAssetInterestRateModelOtherWrapper').hide() : $('#DeployAssetInterestRateModelOtherWrapper').show();
    });

    $(document).on('click', '#deployPoolButton', App.handleDeployPool);
    $(document).on('click', '#deployAssetButton', App.handleDeployAsset);
  },
  
  /**
   * Deploys a new Fuse pool.
   */
  handleDeployPool: async function(event) {
    event.preventDefault();

    var poolName = $('#DeployPoolName').val();
    var closeFactor = $('#DeployPoolCloseFactor').val();
    if (closeFactor === "") closeFactor = Web3.utils.toBN(0.5e18);
    else closeFactor = Web3.utils.toBN((new Big(closeFactor)).mul((new Big(10)).pow(18)).toFixed(0));
    var maxAssets = $('#DeployPoolMaxAssets').val();
    if (maxAssets === "") maxAssets = 20;
    var liquidationIncentive = $('#DeployPoolLiquidationIncentive').val();
    if (liquidationIncentive === "") liquidationIncentive = Web3.utils.toBN(1.08e18);
    else liquidationIncentive = Web3.utils.toBN((new Big(liquidationIncentive)).mul((new Big(10)).pow(18)).toFixed(0));
    var priceOracle = $('#DeployPoolPriceOracle').val() && $('#DeployPoolPriceOracle').val().length > 0 ? $('#DeployPoolPriceOracle').val() : $('#DeployPoolPriceOracleOther').val();
    // TODO: Correct public PreferredPriceOracle and public UniswapView addresses
    if (priceOracle === "PreferredPriceOracle" && Fuse.PUBLIC_PREFERRED_PRICE_ORACLE_CONTRACT_ADDRESS && confirm("Would you like to use the public PreferredPriceOracle? There is no reason to say no unless you need to use SushiSwap (or another Uniswap V2 fork) or you need to set fixed prices for tokens other than WETH.")) priceOracle = Fuse.PUBLIC_PREFERRED_PRICE_ORACLE_CONTRACT_ADDRESS;
    if (priceOracle === "UniswapView" && Fuse.PUBLIC_UNISWAP_VIEW_CONTRACT_ADDRESS && confirm("Would you like to use the public UniswapView? There is no reason to say no unless you need to use SushiSwap (or another Uniswap V2 fork) or you need to set fixed prices for tokens other than WETH.")) priceOracle = Fuse.PUBLIC_UNISWAP_VIEW_CONTRACT_ADDRESS;
    if (priceOracle === "UniswapAnchoredView" && Fuse.PUBLIC_UNISWAP_ANCHORED_VIEW_CONTRACT_ADDRESS && confirm("Would you like to use the public UniswapAnchoredView? Say yes to use Coinbase Pro as a reporter, and say no to user another price oracle as a reporter.")) priceOracle = Fuse.PUBLIC_UNISWAP_ANCHORED_VIEW_CONTRACT_ADDRESS;
    var reporter = null;
    if (priceOracle === "UniswapAnchoredView") reporter = prompt("What reporter address would you like to use? (Coinbase Pro is the default.)", "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC");
    var isPrivate = parseInt($('#DeployPoolPrivate').val()) > 0;

    $('#deployPoolButton').prop("disabled", true).html('<div class="loading-icon"><div></div><div></div><div></div></div>');

    await (async function() {
      // Deploy new pool via SDK
      try {
        var [poolAddress, implementationAddress, priceOracleAddress] = await App.fuse.deployPool(poolName, isPrivate, closeFactor, maxAssets, liquidationIncentive, priceOracle, { reporter }, { from: App.selectedAccount });
      } catch (error) {
        return toastr["error"]("Deployment of new Fuse pool failed: " + (error.message ? error.message : error), "Deployment failed");
      }

      // Mixpanel
      if (typeof mixpanel !== 'undefined') mixpanel.track("Pool deployed", { poolAddress, implementationAddress, priceOracleAddress, poolName, isPrivate, closeFactor, maxAssets, liquidationIncentive, priceOracle });

      // Alert success and refresh balances
      toastr["success"]("Deployment of new Fuse pool confirmed! Contract address: " + poolAddress, "Deployment successful");
      App.getFusePools();
      App.getMyFusePools();
    })();

    $('#deployPoolButton').text("Deploy");
    $('#deployPoolButton').prop("disabled", false);
  },
  
  /**
   * Deploys a new asset to an existing Fuse pool.
   */
  handleDeployAsset: async function(event) {
    event.preventDefault();

    var conf = {
      underlying: $('#DeployAssetUnderlying').val(),
      comptroller: $('#DeployAssetPool').val(),
      interestRateModel: $('#DeployAssetInterestRateModel').val() && $('#DeployAssetInterestRateModel').val().length > 0 ? $('#DeployAssetInterestRateModel').val() : $('#DeployAssetInterestRateModelOther').val(),
      initialExchangeRateMantissa: Web3.utils.toBN(1e18),
      name: $('#DeployAssetName').val(),
      symbol: $('#DeployAssetSymbol').val(),
      decimals: $('#DeployAssetDecimals').val() !== "" ? $('#DeployAssetDecimals').val() : 8,
      admin: App.selectedAccount // TODO: Flexible?
    };

    var collateralFactor = $('#DeployAssetCollateralFactor').val();
    if (collateralFactor === "") collateralFactor = Web3.utils.toBN(0.75e18);
    else collateralFactor = Web3.utils.toBN((new Big(collateralFactor)).mul((new Big(10)).pow(18)).toFixed(0));

    var reserveFactor = $('#DeployAssetReserveFactor').val();
    if (reserveFactor === "") reserveFactor = Web3.utils.toBN(0.2e18);
    else reserveFactor = Web3.utils.toBN((new Big(reserveFactor)).mul((new Big(10)).pow(18)).toFixed(0));

    var adminFee = $('#DeployAssetAdminFee').val();
    if (adminFee === "") adminFee = Web3.utils.toBN(0);
    else adminFee = Web3.utils.toBN((new Big(adminFee)).mul((new Big(10)).pow(18)).toFixed(0));

    $('#deployAssetButton').prop("disabled", true).html('<div class="loading-icon"><div></div><div></div><div></div></div>');

    await (async function() {
      // Deploy interest rate model if necessary
      for (const possibleModel of ["WhitePaperInterestRateModel", "JumpRateModel", "DAIInterestRateModelV2"]) if (conf.interestRateModel.indexOf(possibleModel) === 0) {
        if (conf.interestRateModel[conf.interestRateModel.length - 1] === ")") {
          // Get config from inside parentheses
          var openParenIndex = conf.interestRateModel.indexOf("(");
          var interestRateModelConfArray = conf.interestRateModel.substr(openParenIndex + 1, conf.interestRateModel.length - openParenIndex - 2).split(",");
          conf.interestRateModel = conf.interestRateModel.substr(0, openParenIndex);
          switch (conf.interestRateModel) {
            case "WhitePaperInterestRateModel":
              var interestRateModelConf = { baseRatePerYear: Math.trunc(Number(interestRateModelConfArray[0])).toString(), multiplierPerYear: Math.trunc(Number(interestRateModelConfArray[1])).toString() };
              break;
            case "JumpRateModel":
              var interestRateModelConf = { baseRatePerYear: Math.trunc(Number(interestRateModelConfArray[0])).toString(), multiplierPerYear: Math.trunc(Number(interestRateModelConfArray[1])).toString(), jumpMultiplierPerYear: Math.trunc(Number(interestRateModelConfArray[2])).toString(), kink: Math.trunc(Number(interestRateModelConfArray[3])).toString() };
              break;
            case "DAIInterestRateModelV2":
              var interestRateModelConf = { jumpMultiplierPerYear: Math.trunc(Number(interestRateModelConfArray[0])).toString(), kink: Math.trunc(Number(interestRateModelConfArray[1])).toString() };
              break;
          }
        } else {
          // Prompt user for config
          // TODO: Add a modal for this
          switch (conf.interestRateModel) {
            case "WhitePaperInterestRateModel":
              var interestRateModelConf = {
                baseRatePerYear: Math.trunc(prompt("Please enter the base borrow rate per year for your new WhitePaperInterestRateModel:") * 1e18).toString(),
                multiplierPerYear: Math.trunc(prompt("Please enter the slope of the borrow rate per year over utilization rate for your new WhitePaperInterestRateModel:") * 1e18).toString()
              };
              break;
            case "JumpRateModel":
              var interestRateModelConf = {
                baseRatePerYear: Math.trunc(prompt("Please enter the base borrow rate per year for your new JumpRateModel:") * 1e18).toString(),
                multiplierPerYear: Math.trunc(prompt("Please enter the slope of the borrow rate per year over utilization rate for your new JumpRateModel:") * 1e18).toString(),
                jumpMultiplierPerYear: Math.trunc(prompt("Please enter the jump slope (kicks in after the kink) of the borrow rate per year over utilization rate for your new JumpRateModel:") * 1e18).toString(),
                kink: Math.trunc(prompt("Please enter the kink point (utilization rate above which the jump slope kicks in) for your new JumpRateModel:") * 1e18).toString()
              }
              break;
            case "DAIInterestRateModelV2":
              var interestRateModelConf = {
                jumpMultiplierPerYear: Math.trunc(prompt("Please enter the jump slope (kicks in after the kink) of the borrow rate per year over utilization rate for your new DAIInterestRateModelV2:") * 1e18).toString(),
                kink: Math.trunc(prompt("Please enter the kink point (utilization rate above which the jump slope kicks in) for your new DAIInterestRateModelV2:") * 1e18).toString()
              }
              break;
          }
        }

        // Deploy interest rate model
        try {
          conf.interestRateModel = await App.fuse.deployInterestRateModel(conf.interestRateModel, interestRateModelConf, { from: App.selectedAccount });
        } catch (error) {
          return toastr["error"]("Deployment of new interest rate model failed: " + (error.message ? error.message : error), "Deployment failed");
        }

        // TODO: Add interest rate model type, address, etc. to localStorage and retrieve when user connects wallet

        break;
      }

      // Deploy new asset to existing pool via SDK
      try {
        var [assetAddress, implementationAddress, interestRateModel] = await App.fuse.deployAsset(conf, collateralFactor, reserveFactor, adminFee, { from: App.selectedAccount });
      } catch (error) {
        return toastr["error"]("Deployment of asset to Fuse pool failed: " + (error.message ? error.message : error), "Deployment failed");
      }

      // Mixpanel
      if (typeof mixpanel !== 'undefined') mixpanel.track("Asset deployed to pool", { ...conf, assetAddress, implementationAddress, interestRateModel, collateralFactor, reserveFactor, adminFee });

      // Alert success and refresh balances
      toastr["success"]("Deployment of asset to Fuse pool confirmed! Contract address: " + assetAddress, "Deployment successful");
    })();

    $('#deployAssetButton').text("Deploy");
    $('#deployAssetButton').prop("disabled", false);
  },

  /**
   * Gets all public Fuse pools in the directory.
   */
  getFusePools: async function() {
    console.log('Getting all Fuse pools...');

    try {
      // Add pools to table
      var data = await App.fuse.contracts.FusePoolDirectory.methods.getPublicPoolsWithData().call();
    } catch (err) {
      return console.error(err);
    }

    var indexes = data["0"];
    var pools = data["1"];
    var totalSupplyEth = data["2"];
    var totalBorrowEth = data["3"];
    var html = '';
    for (var i = 0; i < pools.length; i++) html += '<tr data-id="' + indexes[i] + '" data-name="' + pools[i].name + '" data-comptroller="' + pools[i].comptroller + '" data-creator="' + pools[i].creator + '" data-privacy="' + (pools[i].isPrivate ? 1 : 0) + '"><td scope="row">#' + (i + 1) + '</td><td><a href="https://etherscan.io/address/' + pools[i].comptroller + '">' + pools[i].name + '</a></td><td><a href="https://etherscan.io/address/' + pools[i].creator + '">' + pools[i].creator + '</a></td><td>' + (new Big(totalSupplyEth[i])).div(1e18).toFormat(4) + ' ETH</td><td>' + (new Big(totalBorrowEth[i])).div(1e18).toFormat(4) + ' ETH</td><td class="text-danger">Unverified</td><td class="text-right" data-toggle="tooltip" data-placement="bottom" title="' + (new Date(pools[i].timestampPosted * 1000)).toISOString() + '">' + timeago.format(pools[i].timestampPosted * 1000) + '</td></tr>';
    $('.pools-table-public tbody').html(html);
    $('.pools-table-public [data-toggle="tooltip"]').tooltip();

    // Add pool asset click handlers
    App.bindPoolTableEvents('.pools-table-public');
  },

  /**
   * Gets the user's deployed Fuse pools in the directory.
   */
  getMyFusePools: async function() {
    console.log('Getting my Fuse pools...');

    try {
      // Add pools to table
      var data = await App.fuse.contracts.FusePoolDirectory.methods.getPoolsByAccountWithData(App.selectedAccount).call();
    } catch (err) {
      return console.error(err);
    }

    var indexes = data["0"];
    var pools = data["1"];
    var totalSupplyEth = data["2"];
    var totalBorrowEth = data["3"];
    var html = '';
    for (var i = 0; i < pools.length; i++) html += '<tr data-id="' + indexes[i] + '" data-name="' + pools[i].name + '" data-comptroller="' + pools[i].comptroller + '" data-creator="' + App.selectedAccount + '" data-privacy="' + (pools[i].isPrivate ? 1 : 0) + '"><td scope="row">#' + (i + 1) + '</td><td><a href="https://etherscan.io/address/' + pools[i].comptroller + '">' + pools[i].name + '</a></td><td>' + (new Big(totalSupplyEth[i])).div(1e18).toFormat(4) + ' ETH</td><td>' + (new Big(totalBorrowEth[i])).div(1e18).toFormat(4) + ' ETH</td><td>' + (pools[i].isPrivate ? "Private" : "Public") + '</td><td class="text-danger">Unverified</td><td class="text-right" data-toggle="tooltip" data-placement="bottom" title="' + (new Date(pools[i].timestampPosted * 1000)).toISOString() + '">' + timeago.format(pools[i].timestampPosted * 1000) + '</td></tr>';
    $('.pools-table-private tbody').html(html);
    $('.pools-table-private [data-toggle="tooltip"]').tooltip();
    html = '<option selected disabled>Select a pool...</option>';
    for (var i = 0; i < pools.length; i++) html += '<option value="' + pools[i].comptroller + '" data-id="' + indexes[i] + '">' + pools[i].name + '</option>';
    $('#DeployAssetPool').html(html);

    // Add pool asset click handlers
    App.bindPoolTableEvents('.pools-table-private');
  },

  /**
   * Displays a chart with interest rates by utilization rate.
   */
  initInterestRateModelChart: function(borrowerRates, supplierRates) {
    // Init chart
    var ctx = document.getElementById('chart-interest-rate-model').getContext('2d');
    var color = Chart.helpers.color;

    var cfg = {
      data: {
        datasets: [{
          label: 'Borrower Rate',
          backgroundColor: color("rgb(255, 99, 132)").alpha(0.5).rgbString(),
          borderColor: "rgb(255, 99, 132)",
          data: borrowerRates,
          pointRadius: 0,
        }, {
          label: 'Supplier Rate',
          backgroundColor: color("rgb(54, 162, 235)").alpha(0.5).rgbString(),
          borderColor: "rgb(54, 162, 235)",
          data: supplierRates,
          pointRadius: 0,
        }]
      },
      options: {
        aspectRatio: 1,
        scales: {
          xAxes: [{
						type: 'linear',
            scaleLabel: {
              display: true,
              labelString: 'Utilization Rate (%)'
            }
          }],
          yAxes: [{
						type: 'linear',
            scaleLabel: {
              display: true,
              labelString: 'Interest Rate (%)'
            }
          }]
        },
        tooltips: {
          intersect: false,
          mode: 'index',
          callbacks: {
            title: function(tooltipItems, myData) {
              return "Utilization: " + tooltipItems[0].xLabel + "%";
            },
            label: function(tooltipItem, myData) {
              var label = myData.datasets[tooltipItem.datasetIndex].label || '';
              if (label) label += ': ';
              label += parseFloat(tooltipItem.value).toFixed(2) + "%";
              return label;
            }
          }
        }
      }
    };

    var chart = Chart.Line(ctx, cfg);
  },

  /**
   * Adds click handlers to pool assets.
   */
  bindPoolTableEvents: function(selector) {
    // Pool click handlers
    $(selector + ' tbody tr').click(async function() {
      // Set pool name
      $('.pool-detailed-name').text($(this).data("name"));

      // Get comptroller address and contract
      var comptroller = $(this).data("comptroller");
      var comptrollerInstance = new App.web3.eth.Contract(App.comptrollerAbi, comptroller);

      // Get price oracle contract name and type
      var priceOracle = await comptrollerInstance.methods.oracle().call();
      var priceOracleContractName = priceOracle;
      if (priceOracle == Fuse.PUBLIC_CHAINLINK_PRICE_ORACLE_CONTRACT_ADDRESS) priceOracleContractName = "\u2714\uFE0F ChainlinkPriceOracle";
      else if (priceOracle == Fuse.PUBLIC_UNISWAP_VIEW_CONTRACT_ADDRESS) priceOracleContractName = "\u26A0\uFE0F UniswapView - Public";
      else if (priceOracle == Fuse.PUBLIC_PREFERRED_PRICE_ORACLE_CONTRACT_ADDRESS) priceOracleContractName = "\u26A0\uFE0F PreferredPriceOracle - Public";
      else {
        var potentialName = await App.fuse.getPriceOracle(priceOracle);
        if (potentialName !== null) {
          priceOracleContractName = potentialName;
          if (priceOracleContractName === "PreferredPriceOracle") priceOracleContractName = "\u26A0\uFE0F\u26A0\uFE0F PreferredPriceOracle - Private";
          else if (priceOracleContractName === "UniswapView") priceOracleContractName = "\u26A0\uFE0F\u26A0\uFE0F UniswapAnchoredView - Private";
          else if (priceOracleContractName === "UniswapAnchoredView") priceOracleContractName = "\u26A0\uFE0F\u26A0\uFE0F UniswapAnchoredView - Private";
        }
      }

      // Set pool details/stats
      $('.pool-detailed-creator').text($(this).data("creator"));
      $('.pool-detailed-close-factor').text((new Big(await comptrollerInstance.methods.closeFactorMantissa().call())).div(1e18).toFormat(4));
      $('.pool-detailed-max-assets').text(await comptrollerInstance.methods.maxAssets().call());
      $('.pool-detailed-liquidation-incentive').text((new Big(await comptrollerInstance.methods.liquidationIncentiveMantissa().call())).div(1e18).toFormat(4));
      $('.pool-detailed-oracle').text(priceOracleContractName); // Get oracle name from bytecode
      $('.pool-detailed-privacy').text(parseInt($(this).data("privacy")) > 0 ? "Private" : "Public");

      // Add assets to tables
      var cTokens = await App.fuse.contracts.FusePoolDirectory.methods.getPoolAssetsWithData(comptroller).call({ from: App.selectedAccount });
      var html = '';
      for (var i = 0; i < cTokens.length; i++) {
        var underlyingDecimals = parseInt(cTokens[i].underlyingDecimals);
        html += '<tr data-ctoken="' + cTokens[i].cToken + '" data-underlying="' + cTokens[i].underlyingToken + '" data-symbol="' + cTokens[i].underlyingSymbol + '" data-decimals="' + cTokens[i].underlyingDecimals + '"><td scope="row">' + cTokens[i].underlyingName + '</td><td>' + cTokens[i].underlyingSymbol + '</td><td><a href="#" class="apy">' + (new Big(cTokens[i].supplyRatePerBlock)).mul(2372500).div(1e16).toFormat(2) + '</a></td><td>' + (new Big(cTokens[i].totalSupply)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].supplyBalance)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].underlyingBalance)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input collateral-switch" data-comptroller="' + comptroller + '" id="collateral-switch-' + (i + 1) + '"' + (cTokens[i].membership ? " checked" : "") + '><label class="custom-control-label" for="collateral-switch-' + (i + 1) + '">Collateral</label></div></td><td><button type="button" class="btn btn-success btn-sm button-deposit">Deposit</button><button type="button" class="btn btn-danger btn-sm button-withdraw">Withdraw</button></td></tr>';
      }
      $('.pool-detailed-table-assets-supply tbody').html(html);
      html = '';
      for (var i = 0; i < cTokens.length; i++) {
        var underlyingDecimals = parseInt(cTokens[i].underlyingDecimals);
        html += '<tr data-ctoken="' + cTokens[i].cToken + '" data-underlying="' + cTokens[i].underlyingToken + '" data-symbol="' + cTokens[i].underlyingSymbol + '" data-decimals="' + cTokens[i].underlyingDecimals + '"><td scope="row">' + cTokens[i].underlyingName + '</td><td>' + cTokens[i].underlyingSymbol + '</td><td><a href="#" class="apy">' + (new Big(cTokens[i].borrowRatePerBlock)).mul(2372500).div(1e16).toFormat(2) + '</a></td><td>' + (new Big(cTokens[i].totalBorrow)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].borrowBalance)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].underlyingBalance)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].liquidity)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td><button type="button" class="btn btn-warning btn-sm button-borrow">Borrow</button><button type="button" class="btn btn-primary btn-sm button-repay">Repay</button></td></tr>';
      }
      $('.pool-detailed-table-assets-borrow tbody').html(html);

      // APY click handler
      $('.pool-detailed-table-assets-supply .apy, .pool-detailed-table-assets-borrow .apy').click(async function() {
        var interestRateModel = await App.fuse.getInterestRateModel($(this).closest('tr').data("ctoken"));
        if (interestRateModel === null) return toastr["error"]("Interest rate model not recognized.", "APY predictions failed");
        var borrowerRates = [];
        var supplierRates = [];
        for (var i = 0; i <= 100; i++) {
          borrowerRates.push({ x: i, y: Number((new Big(interestRateModel.getBorrowRate(Web3.utils.toBN(i * 1e16)).toString())).mul(2372500).div(1e16)) });
          supplierRates.push({ x: i, y: Number((new Big(interestRateModel.getSupplyRate(Web3.utils.toBN(i * 1e16)).toString())).mul(2372500).div(1e16)) });
        }
        App.initInterestRateModelChart(borrowerRates, supplierRates);
        $('#modal-interest-rate-model').modal('show');
      });

      // Unhealthy accounts table
      var data = await App.fuse.contracts.FusePoolDirectory.methods.getPoolUsersWithData(comptroller, Web3.utils.toBN(1e18)).call();
      var borrowers = data["0"];
      borrowers.sort((a, b) => parseInt(b.totalBorrow) - parseInt(a.totalBorrow));
      var closeFactor = (new Big(data["1"])).div(1e18);
      var liquidationIncentive = (new Big(data["2"])).div(1e18);
      var html = '';

      for (var borrower of borrowers) {
        // Get debt and collateral
        borrower = { ...borrower };
        borrower.debt = [];
        borrower.collateral = [];

        for (var asset of borrower.assets) {
          asset = { ...asset };
          asset.borrowBalanceEth = new Big(asset.borrowBalance).mul(asset.underlyingPrice).div(1e36);
          asset.supplyBalanceEth = new Big(asset.supplyBalance).mul(asset.underlyingPrice).div(1e36);
          if (parseInt(asset.borrowBalance) > 0) borrower.debt.push(asset);
          if (asset.membership && parseInt(asset.supplyBalance) > 0) borrower.collateral.push(asset);
        }

        // Sort debt and collateral from highest to lowest ETH value
        borrower.debt.sort((a, b) => b.borrowBalanceEth.gt(a.borrowBalanceEth));
        borrower.collateral.sort((a, b) => b.supplyBalanceEth.gt(a.supplyBalanceEth));

        // Get max liquidation value across all borrows
        borrower.maxLiquidationValue = new Big(borrower.totalBorrow).mul(closeFactor).div(1e18);

        // Get debt and collateral prices
        const underlyingDebtPrice = (new Big(borrower.debt[0].underlyingPrice)).div((new Big(10)).pow(36 - borrower.debt[0].underlyingDecimals));
        const underlyingCollateralPrice = (new Big(borrower.collateral[0].underlyingPrice)).div((new Big(10)).pow(36 - borrower.collateral[0].underlyingDecimals));

        // Get liquidation amount
        var debtAmount = new Big(borrower.debt[0].borrowBalance).div((new Big(10)).pow(parseInt(borrower.debt[0].underlyingDecimals)));
        var liquidationAmount = debtAmount.mul(closeFactor);
        var liquidationValueEth = liquidationAmount.mul(underlyingDebtPrice);

        // Get seize amount
        var seizeAmountEth = liquidationValueEth.mul(liquidationIncentive);
        var seizeAmount = seizeAmountEth.div(underlyingCollateralPrice);

        // Check if actual collateral is too low to seize seizeAmount; if so, recalculate liquidation amount
        const actualCollateral = (new Big(borrower.collateral[0].supplyBalance)).div((new Big(10)).pow(parseInt(borrower.collateral[0].underlyingDecimals)));
        
        if (seizeAmount.gt(actualCollateral)) {
          seizeAmount = actualCollateral;
          seizeAmountEth = seizeAmount.mul(underlyingCollateralPrice);
          liquidationValueEth = seizeAmountEth.div(liquidationIncentive);
          liquidationAmount = liquidationValueEth.div(underlyingDebtPrice);
        }

        // Add info to predictions array
        borrower.predictions = [];
        borrower.predictions.push("Liquidate " + liquidationAmount.toFormat(8) + " " + borrower.debt[0].underlyingSymbol + " (" + liquidationValueEth.toFormat(8) + " ETH) debt");
        borrower.predictions.push("Collect " + seizeAmount.toFormat(8) + borrower.collateral[0].underlyingSymbol + " (" + seizeAmountEth.toFormat(8) + " ETH) collateral");

        // Calculate expected gas fee
        let expectedGasAmount = 0;

        try {
          if (borrower.debt[0].underlyingSymbol === 'ETH') {
            expectedGasAmount = await App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, borrower.debt[0].cToken, borrower.collateral[0].cToken, 0, borrower.collateral[0].cToken).estimateGas({ gas: 1e9, value: liquidationAmount.mul((new Big(10)).pow(parseInt(borrower.debt[0].underlyingDecimals))).toFixed(0), from: App.selectedAccount });
          } else {
            expectedGasAmount = await App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, liquidationAmount.mul((new Big(10)).pow(parseInt(borrower.debt[0].underlyingDecimals))).toFixed(0), borrower.debt[0].cToken, borrower.collateral[0].cToken, 0, borrower.collateral[0].cToken).estimateGas({ gas: 1e9, from: App.selectedAccount });
          }
        } catch {
          expectedGasAmount = 600000;
        }

        const gasPrice = new Big(await App.web3.eth.getGasPrice()).div(1e18);
        const expectedGasFee = gasPrice.mul(expectedGasAmount);
        borrower.predictions.push("Gas Amount = " + expectedGasAmount + ", Gas Fee = " + expectedGasFee.toFormat(8) + " ETH");

        // Calculate expected profit after gas fees
        const expectedRevenue = seizeAmount.mul(underlyingCollateralPrice).sub(liquidationAmount.mul(underlyingDebtPrice));
        borrower.predictions.push("Expected Revenue = " + expectedRevenue.toFormat(8) + "ETH");
        const expectedProfit = expectedRevenue.sub(expectedGasFee);
        borrower.predictions.push("Expected Profit = " + expectedProfit.toFormat(8) + "ETH");

        // Calculate minSeizeAmount: we want expectedProfit = 0, so expectedRevenue = expectedGasFee
        var minSeizeAmount = expectedGasFee.add(liquidationAmount.mul(underlyingDebtPrice)).div(underlyingCollateralPrice);
        
        // Add row to table
        html += `<tr data-borrower="` + borrower.account + `" data-debt-ctoken="` + borrower.debt[0].cToken + `" data-debt-underlying="` + borrower.debt[0].underlyingToken + `" data-debt-symbol="` + borrower.debt[0].underlyingSymbol + `" data-debt-decimals="` + borrower.debt[0].underlyingDecimals + `" data-liquidation-amount="` + liquidationAmount.toFixed(parseInt(borrower.debt[0].underlyingDecimals)) + `" data-collateral-ctoken="` + borrower.collateral[0].cToken + `" data-collateral-underlying="` + borrower.collateral[0].underlyingToken + `"data-collateral-symbol="` + borrower.collateral[0].underlyingSymbol + `" data-collateral-decimals="` + borrower.collateral[0].underlyingDecimals + `" data-min-seize="` + minSeizeAmount.toFixed(parseInt(borrower.collateral[0].underlyingDecimals)) + `">
          <td scope="row">` + borrower.account + `</td>
          <td>` + (new Big(borrower.health)).div(1e18).toFormat(8) + `</td>
          <td>` + (new Big(borrower.totalBorrow)).div(1e18).toFormat(8) + ` ETH</td>
          <td>` + borrower.maxLiquidationValue.toFormat(8) + ` ETH</td>
          <td>
            <ul class="m-0 p-0" style="list-style-type: none;">` + borrower.debt.map((asset) => {
              return '<li key="' + asset.underlyingToken + '">' + asset.underlyingSymbol + ': ' + (new Big(asset.borrowBalance)).div((new Big(10)).pow(parseInt(asset.underlyingDecimals))).toFormat(8) + '</li>';
            }) + `</ul>
          </td>
          <td>
            <ul class="m-0 p-0" style="list-style-type: none;">` + borrower.debt.map((asset) => {
              return '<li key="' + asset.underlyingToken + '">' + asset.underlyingSymbol + ': ' + asset.borrowBalanceEth.toFormat(8) + ' ETH</li>';
            }) + `</ul>
          </td>
          <td>` + (new Big(borrower.totalCollateral)).div(1e18).toFormat(8) + ` ETH</td>
          <td>
            <ul class="m-0 p-0" style="list-style-type: none;">` + borrower.collateral.map((asset) => {
              return '<li key="' + asset.underlyingToken + '">' + asset.underlyingSymbol + ': ' + (new Big(asset.supplyBalance)).div((new Big(10)).pow(parseInt(asset.underlyingDecimals))).toFormat(8) + '</li>';
            }) + `</ul>
          </td>
          <td>
            <ul class="m-0 p-0" style="list-style-type: none;">` + borrower.collateral.map((asset) => {
              return '<li key="' + asset.underlyingToken + '">' + asset.underlyingSymbol + ': ' + asset.supplyBalanceEth.toFormat(8) + ' ETH</li>';
            }) + `</ul>
          </td>
          <td>
            <ul class="m-0 p-0" style="list-style-type: none;">` + borrower.predictions.map((tx, i) => {
              return '<li key="' + i + '">' + tx + '</li>';
            }) + `</ul>
          </td>
          <td><button type="button" class="btn btn-info btn-sm button-liquidate">Liquidate</button></td>
        </tr>`;
      }

      $('.pool-detailed-table-liquidations tbody').html(html);
      
      // Switch pages
      $('#page-pools').hide();
      $('#page-pool').show();

      // Collateral switch handler
      $('.pool-detailed-table-assets-supply .collateral-switch').change(async function() {
        var comptroller = new App.web3.eth.Contract(App.comptrollerAbi, $(this).data("comptroller"));

        if ($(this).is(':checked')) {
          try {
            await comptroller.methods.enterMarkets([$(this).closest('tr').data("ctoken")]).send({ from: App.selectedAccount });
          } catch (error) {
            $(this).prop("checked", false);
            return toastr["error"]("Entering market failed: " + (error.message ? error.message : error), "Entering market failed");
          }
        } else {
          try {
            await comptroller.methods.exitMarket($(this).closest('tr').data("ctoken")).send({ from: App.selectedAccount });
          } catch (error) {
            $(this).prop("checked", true);
            return toastr["error"]("Exiting market failed: " + (error.message ? error.message : error), "Exiting market failed");
          }
        }
      });

      // Supply tab button handlers
      $('.pool-detailed-table-assets-supply .button-deposit').click(async function() {
        var token = new App.web3.eth.Contract(App.erc20Abi, $(this).closest('tr').data("underlying"));
        var underlyingSymbol = $(this).closest('tr').data("symbol");
        var balance = await (underlyingSymbol === "ETH" ? App.web3.eth.getBalance(App.selectedAccount) : token.methods.balanceOf(App.selectedAccount).call());
        var underlyingDecimals = $(this).closest('tr').data("decimals");
        $('#modal-deposit #DepositAmount').val((new Big(balance)).div((new Big(10)).pow(underlyingDecimals)).toFixed());
        $('#modal-deposit #DepositCurrencyName').val($(this).closest('tr').data("name"));
        $('#modal-deposit #DepositCurrencySymbol option').text(underlyingSymbol);
        $('#modal-deposit').modal('show');
        var cToken = new App.web3.eth.Contract(underlyingSymbol === "ETH" ? App.cEtherAbi : App.cErc20Abi, $(this).closest('tr').data("ctoken"));
      
        $('#modal-deposit #depositButton').off('click').click(async function() {
          var amount = $('#DepositAmount').val();
          if (!amount) return toastr["error"]("Invalid deposit amount.", "Deposit failed");
          amount = Web3.utils.toBN((new Big(amount)).mul((new Big(10)).pow(underlyingDecimals)).toFixed(0));

          if (underlyingSymbol !== "ETH") {
            try {
              await token.methods.approve(cToken.options.address, amount).send({ from: App.selectedAccount });
            } catch (error) {
              return toastr["error"]("Approval failed: " + (error.message ? error.message : error), "Deposit failed");
            }
          }

          try {
            await (underlyingSymbol === "ETH" ? cToken.methods.mint().send({ from: App.selectedAccount, value: amount }) : cToken.methods.mint(amount).send({ from: App.selectedAccount }));
          } catch (error) {
            return toastr["error"]("Deposit failed: " + (error.message ? error.message : error), "Deposit failed");
          }

          $('#modal-deposit').modal('hide');
        });
      });

      $('.pool-detailed-table-assets-supply .button-withdraw').click(async function() {
        var cToken = new App.web3.eth.Contract(App.cErc20Abi, $(this).closest('tr').data("ctoken"));
        var balance = await cToken.methods.balanceOfUnderlying(App.selectedAccount).call();
        var underlyingDecimals = $(this).closest('tr').data("decimals");
        $('#modal-withdraw #WithdrawAmount').val((new Big(balance)).div((new Big(10)).pow(underlyingDecimals)).toFixed());
        $('#modal-withdraw #WithdrawCurrencyName').val($(this).closest('tr').data("name"));
        $('#modal-withdraw #WithdrawCurrencySymbol option').text($(this).closest('tr').data("symbol"));
        $('#modal-withdraw').modal('show');
      
        $('#modal-withdraw #withdrawButton').off('click').click(async function() {
          var amount = $('#WithdrawAmount').val();
          if (!amount) return toastr["error"]("Invalid withdrawal amount.", "Withdrawal failed");
          amount = Web3.utils.toBN((new Big(amount)).mul((new Big(10)).pow(underlyingDecimals)).toFixed(0));

          try {
            await cToken.methods.redeemUnderlying(amount).send({ from: App.selectedAccount });
          } catch (error) {
            return toastr["error"]("Withdrawal failed: " + (error.message ? error.message : error), "Withdrawal failed");
          }

          $('#modal-withdraw').modal('hide');
        });
      });
      
      // Borrow tab button handlers
      $('.pool-detailed-table-assets-borrow .button-borrow').click(async function() {
        // TODO: Get max borrow?
        $('#modal-borrow #BorrowCurrencyName').val($(this).closest('tr').data("name"));
        $('#modal-borrow #BorrowCurrencySymbol option').text($(this).closest('tr').data("symbol"));
        $('#modal-borrow').modal('show');
        var underlyingDecimals = $(this).closest('tr').data("decimals");
        var cToken = new App.web3.eth.Contract(App.cErc20Abi, $(this).closest('tr').data("ctoken"));
      
        $('#modal-borrow #borrowButton').off('click').click(async function() {
          var amount = $('#BorrowAmount').val();
          if (!amount) return toastr["error"]("Invalid borrow amount.", "Borrow failed");
          amount = Web3.utils.toBN((new Big(amount)).mul((new Big(10)).pow(underlyingDecimals)).toFixed(0));

          try {
            await cToken.methods.borrow(amount).send({ from: App.selectedAccount });
          } catch (error) {
            return toastr["error"]("Borrow failed: " + (error.message ? error.message : error), "Borrow failed");
          }

          $('#modal-borrow').modal('hide');
        });
      });
      
      $('.pool-detailed-table-assets-borrow .button-repay').click(async function() {
        var underlyingSymbol = $(this).closest('tr').data("symbol");
        var cToken = new App.web3.eth.Contract(underlyingSymbol === "ETH" ? App.cEtherAbi : App.cErc20Abi, $(this).closest('tr').data("ctoken"));
        var balance = await cToken.methods.borrowBalanceCurrent(App.selectedAccount).call();
        var underlyingDecimals = $(this).closest('tr').data("decimals");
        $('#modal-repay #RepayAmount').val((new Big(balance)).div((new Big(10)).pow(underlyingDecimals)).toFixed());
        $('#modal-repay #RepayCurrencyName').val($(this).closest('tr').data("name"));
        $('#modal-repay #RepayCurrencySymbol option').text($(this).closest('tr').data("symbol"));
        $('#modal-repay').modal('show');
        var token = new App.web3.eth.Contract(App.erc20Abi, $(this).closest('tr').data("underlying"));

        $('#modal-repay #repayButton').off('click').click(async function() {
          var amount = $('#RepayAmount').val();
          if (!amount) return toastr["error"]("Invalid repayment amount.", "Repayment failed");
          amount = Web3.utils.toBN((new Big(amount)).mul((new Big(10)).pow(underlyingDecimals)).toFixed(0));

          if (underlyingSymbol !== "ETH") {
            try {
              await token.methods.approve(cToken.options.address, amount).send({ from: App.selectedAccount });
            } catch (error) {
              return toastr["error"]("Approval failed: " + (error.message ? error.message : error), "Repayment failed");
            }
          }

          try {
            await (underlyingSymbol === "ETH" ? cToken.methods.repayBorrow().send({ from: App.selectedAccount, value: amount }) : cToken.methods.repayBorrow(amount).send({ from: App.selectedAccount }));
          } catch (error) {
            return toastr["error"]("Repayment failed: " + (error.message ? error.message : error), "Repayment failed");
          }

          $('#modal-repay').modal('hide');
        });
      });

      // Liquidation button handler
      $('.pool-detailed-table-liquidations .button-liquidate').click(async function() {
        var debtCToken = $(this).closest('tr').data("debt-ctoken");
        var underlyingDebtToken = $(this).closest('tr').data("debt-underlying");
        var underlyingDebtSymbol = $(this).closest('tr').data("debt-symbol");
        var underlyingDebtDecimals = $(this).closest('tr').data("debt-decimals");
        var liquidationAmount = $(this).closest('tr').data("liquidation-amount");
        var collateralCToken = $(this).closest('tr').data("collateral-ctoken");
        var underlyingCollateralToken = $(this).closest('tr').data("collateral-underlying");
        var underlyingCollateralSymbol = $(this).closest('tr').data("collateral-symbol");
        var underlyingCollateralDecimals = $(this).closest('tr').data("collateral-decimals");
        var minSeize = $(this).closest('tr').data("min-seize");
        $('#modal-liquidate #LiquidateAmount').val(liquidationAmount);
        $('#modal-liquidate #LiquidateCurrencySymbol option').text(underlyingDebtSymbol);
        $('#modal-liquidate #LiquidateMethod').val("uniswap");
        $('#modal-liquidate #LiquidateMethod option[value="aave"]').prop("disabled", ["DAI", "USDC", "TUSD", "USDT", "sUSD", "BUSD", "ETH", "AAVE", "UNI", "YFI", "BAT", "REN", "ENJ", "KNC", "LINK", "MANA", "MKR", "SNX", "WBTC", "ZRX", "CRV"].indexOf(underlyingDebtSymbol) < 0); // TODO: Check underlying token addresses instead of symbols
        $('#modal-liquidate #LiquidateMinSeize').val(minSeize);
        $('#modal-liquidate #LiquidateMinSeizeWrapper').hide();
        $('#modal-liquidate #LiquidateMinProfit').val(0);
        $('#modal-liquidate #LiquidateMinProfitWrapper').show();
        $('#modal-liquidate #LiquidateSeizeCurrencySymbol option[value="collateral"], #modal-liquidate #LiquidateProfitCurrencySymbol option[value="collateral"]').text(underlyingCollateralSymbol);
        $('#modal-liquidate #LiquidateSeizeCurrencySymbol option[value="debt"], #modal-liquidate #LiquidateProfitCurrencySymbol option[value="debt"]').text(underlyingDebtSymbol);
        $('#modal-liquidate #LiquidateSeizeCurrencySymbol, #modal-liquidate #LiquidateProfitCurrencySymbol').val("collateral");
        $('#modal-liquidate #LiquidateExchangeProfitTo').val("");
        $('#modal-liquidate #LiquidateExchangeProfitToWrapper').hide();
        $('#modal-liquidate').modal('show');
        var debtToken = new App.web3.eth.Contract(App.erc20Abi, underlyingDebtToken);

        $('#modal-liquidate #LiquidateMethod').off('change').change(function() {
          if ($(this).val() === "uniswap") {
            $('#LiquidateExchangeProfitTo').attr("placeholder", "Exchange Profit To ERC20");
            $('#modal-liquidate #LiquidateMinSeizeWrapper').hide();
            $('#modal-liquidate #LiquidateMinProfitWrapper').show();
          } else {
            $('#LiquidateExchangeProfitTo').attr("placeholder", "Exchange Seized Collateral To ERC20");
            $('#modal-liquidate #LiquidateMinProfitWrapper').hide();
            $('#modal-liquidate #LiquidateMinSeizeWrapper').show();
          }
        });

        $('#modal-liquidate #LiquidateSeizeCurrencySymbol, #modal-liquidate #LiquidateProfitCurrencySymbol').off('change').change(function() {
          $('#modal-liquidate #LiquidateSeizeCurrencySymbol, #modal-liquidate #LiquidateProfitCurrencySymbol').val($(this).val());
          $(this).val() === "other" ? $('#LiquidateExchangeProfitToWrapper').show() : $('#LiquidateExchangeProfitToWrapper').hide();
        });

        $('#modal-liquidate #liquidateButton').off('click').click(async function() {
          // Validate amount and get liquidation method
          var amount = $('#LiquidateAmount').val();
          if (!amount) return toastr["error"]("Invalid liquidation amount.", "Liquidation failed");
          amount = Web3.utils.toBN((new Big(amount)).mul((new Big(10)).pow(underlyingDebtDecimals)).toFixed(0));
          var liquidateMethod = $('#LiquidateMethod').val();

          // Validate exchangeProfitTo
          var exchangeProfitTo = liquidateMethod === "uniswap" ? $('#modal-liquidate #LiquidateProfitCurrencySymbol').val() : $('#modal-liquidate #LiquidateSeizeCurrencySymbol').val();
          if (exchangeProfitTo == "collateral") exchangeProfitTo = underlyingCollateralToken;
          else if (exchangeProfitTo == "debt") exchangeProfitTo = underlyingDebtToken;
          else if (exchangeProfitTo == "eth") exchangeProfitTo = "0x0000000000000000000000000000000000000000";
          else exchangeProfitTo = $('#LiquidateExchangeProfitTo').val();
          if (!exchangeProfitTo) return toastr["error"]("No destination currency specified for seized collateral.", "Liquidation failed");

          // Get exchangeProfitTo decimal precision
          var exchangeProfitToDecimals = 18;

          if (exchangeProfitTo !== "0x0000000000000000000000000000000000000000") try {
            exchangeProfitToDecimals = parseInt(await (new App.web3.eth.Contract(App.erc20Abi, exchangeProfitTo)).methods.decimals().call());
          } catch {
            return toastr["error"]("Failed to retrieve decimal precision of exchange output token.", "Liquidation failed");
          }

          // Validate method (flashloan or no flashloan)
          if (liquidateMethod === "uniswap") {
            // Liquidate via flashloan
            var minProfit = $('#LiquidateMinProfit').val();
            if (!minProfit) minProfit = Web3.utils.toBN(0);
            else minProfit = Web3.utils.toBN((new Big(minProfit)).mul((new Big(10)).pow(exchangeProfitToDecimals)).toFixed(0));

            try {
              await (underlyingDebtSymbol === "ETH" ? App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidateToEthWithFlashLoan(borrower.account, amount, debtCToken, collateralCToken, minProfit, exchangeProfitTo).send({ from: App.selectedAccount }) : App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidateToTokensWithFlashLoan(borrower.account, amount, debtCToken, collateralCToken, minProfit, exchangeProfitTo).send({ from: App.selectedAccount }));
            } catch (error) {
              return toastr["error"]("Liquidation failed: " + (error.message ? error.message : error), "Liquidation failed");
            }
          } else {
            // Liquidate using local capital
            var minSeize = $('#LiquidateMinSeize').val();
            if (!minSeize) minSeize = Web3.utils.toBN(0);
            else minSeize = Web3.utils.toBN((new Big(minSeize)).mul((new Big(10)).pow(exchangeProfitToDecimals)).toFixed(0));

            if (underlyingDebtSymbol !== "ETH") {
              try {
                await debtToken.methods.approve(App.fuse.contracts.FuseSafeLiquidator.options.address, amount).send({ from: App.selectedAccount });
              } catch (error) {
                return toastr["error"]("Approval failed: " + (error.message ? error.message : error), "Liquidation failed");
              }
            }

            try {
              await (underlyingDebtSymbol === "ETH" ? App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, debtCToken, collateralCToken, minSeize, exchangeProfitTo).send({ from: App.selectedAccount, value: amount }) : App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, amount, debtCToken, collateralCToken, minSeize, exchangeProfitTo).send({ from: App.selectedAccount }));
            } catch (error) {
              return toastr["error"]("Liquidation failed: " + (error.message ? error.message : error), "Liquidation failed");
            }
          }

          // Hide modal
          $('#modal-repay').modal('hide');
        });
      });
    });
  }
};

$(function() {
  $(document).ready(function() {
    App.init();
  });
});
