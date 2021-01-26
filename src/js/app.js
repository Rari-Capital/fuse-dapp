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
  contracts: {},
  comptrollerAbi: null,
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

    // Refresh contracts to use new Web3
    for (const symbol of Object.keys(App.contracts)) App.contracts[symbol] = new App.web3.eth.Contract(App.contracts[symbol].options.jsonInterface, App.contracts[symbol].options.address);

    // Get user's account balance in the stablecoin fund, RFT balance, and account balance limit
    // TODO: Below
    if (App.contracts.FusePoolDirectory) {
      App.getMyFusePools();
      if (!App.intervalGetMyFusePools) App.intervalGetMyFusePools = setInterval(App.getMyFusePools, 5 * 60 * 1000);
    }

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
    $(".pools-table-private tbody").html('');
    $("#DeployAssetPool option:not(:disabled)").remove('');
  
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
    $('#page-pools').hide();
    $('#page-deploy').show();
    $('#tab-pools').css('text-decoration', '');
    $('#tab-deploy').css('text-decoration', 'underline');
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
    // TODO: Below
    /* $('#FusePools').text("Loading...");
    $('#MyFusePools').text("Loading..."); */
  },
  
  /**
   * Initialize the latest version of web3.js (MetaMask uses an oudated one that overwrites ours if we include it as an HTML tag), then initialize and connect Web3Modal.
   */
  initWeb3: function() {
    $.getScript("js/web3.min.js", function() {
      if (typeof web3 !== 'undefined') {
        App.web3 = new Web3(web3.currentProvider);
      } else {
        App.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/c52a3970da0a47978bee0fe7988b67b6"));
      }
  
      App.initContracts();
      App.initWeb3Modal();
    });
  },
  
  /**
   * Initialize FundManager and FundToken contracts.
   */
  initContracts: function() {
    $.getJSON('abi/FusePoolDirectory.json?v=1611171333', function(data) {
      App.contracts.FusePoolDirectory = new App.web3.eth.Contract(data, "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");
      App.getFusePools();
      setInterval(App.getFusePools, 5 * 60 * 1000);
      if (App.selectedAccount) {
        App.getMyFusePools();
        if (!App.intervalGetMyFusePools) App.intervalGetMyFusePools = setInterval(App.getMyFusePools, 5 * 60 * 1000);
      }
    });

    $.getJSON('abi/FuseSafeLiquidator.json?v=1611171333', function(data) {
      App.contracts.FuseSafeLiquidator = new App.web3.eth.Contract(data, "0x0165878A594ca255338adfa4d48449f69242Eb8F");
    });

    $.getJSON('abi/Comptroller.json?v=1600737538', function(data) {
      App.comptrollerAbi = data;
    });

    $.getJSON('abi/CErc20.json?v=1600737538', function(data) {
      App.cErc20Abi = data;
    });

    $.getJSON('abi/ERC20.json?v=1600737538', function(data) {
      App.erc20Abi = data;
    });
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
      // TODO: Below
      /* if (App.contracts.FusePoolDirectory) {
        App.getMyFusePools();
        if (!App.intervalGetMyFusePools) App.intervalGetMyFusePools = setInterval(App.getMyFusePools, 5 * 60 * 1000);
      } */
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
    var priceOracle = $('#DeployPoolPriceOracle').val();
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
      interestRateModel: $('#DeployAssetInterestRateModel').val(),
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
      // Deploy new asset to existing pool via SDK
      try {
        var [assetAddress, implementationAddress, interestRateModel] = await App.fuse.deployAsset(conf, collateralFactor, reserveFactor, adminFee, { from: App.selectedAccount });
      } catch (error) {
        return toastr["error"]("Deployment of asset to Fuse pool failed: " + (error.message ? error.message : error), "Deployment failed");
      }

      // Mixpanel
      if (typeof mixpanel !== 'undefined') mixpanel.track("Asset deployed to pool", { assetAddress, implementationAddress, interestRateModel, ...conf, collateralFactor, reserveFactor, adminFee });

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
      var data = await App.contracts.FusePoolDirectory.methods.getPublicPoolsWithData().call();
    } catch (err) {
      return console.error(err);
    }

    var indexes = data["0"];
    var pools = data["1"];
    var totalSupplyEth = data["2"];
    var totalBorrowEth = data["3"];
    var html = '';
    for (var i = 0; i < pools.length; i++) html += '<tr data-id="' + indexes[i] + '" data-name="' + pools[i].name + '" data-comptroller="' + pools[i].comptroller + '"><td scope="row">#' + (i + 1) + '</td><td><a href="https://etherscan.io/address/' + pools[i].comptroller + '">' + pools[i].name + '</a></td><td><a href="https://etherscan.io/address/' + pools[i].creator + '">' + pools[i].creator + '</a></td><td>' + (new Big(totalSupplyEth[i])).div(1e18).toFormat(4) + ' ETH</td><td>' + (new Big(totalBorrowEth[i])).div(1e18).toFormat(4) + ' ETH</td><td class="text-danger">Unverified</td><td class="text-right">' + (new Date(pools[i].timestampPosted * 1000)).toISOString() + '</td></tr>';
    $('.pools-table-public tbody').html(html);

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
      var data = await App.contracts.FusePoolDirectory.methods.getPoolsByAccountWithData(App.selectedAccount).call();
    } catch (err) {
      return console.error(err);
    }

    var indexes = data["0"];
    var pools = data["1"];
    var totalSupplyEth = data["2"];
    var totalBorrowEth = data["3"];
    var html = '';
    for (var i = 0; i < pools.length; i++) html += '<tr data-id="' + indexes[i] + '" data-name="' + pools[i].name + '" data-comptroller="' + pools[i].comptroller + '"><td scope="row">#' + (i + 1) + '</td><td><a href="https://etherscan.io/address/' + pools[i].comptroller + '">' + pools[i].name + '</a></td><td>' + (new Big(totalSupplyEth[i])).div(1e18).toFormat(4) + ' ETH</td><td>' + (new Big(totalBorrowEth[i])).div(1e18).toFormat(4) + ' ETH</td><td>' + (pools[i].isPrivate ? "Private" : "Public") + '</td><td class="text-danger">Unverified</td><td class="text-right">' + (new Date(pools[i].timestampPosted * 1000)).toISOString() + '</td></tr>';
    $('.pools-table-private tbody').html(html);
    html = '<option selected disabled>Select a pool...</option>';
    for (var i = 0; i < pools.length; i++) html += '<option value="' + pools[i].comptroller + '" data-id="' + indexes[i] + '">' + pools[i].name + '</option>';
    $('#DeployAssetPool').html(html);

    // Add pool asset click handlers
    App.bindPoolTableEvents('.pools-table-private');
  },

  /**
   * Adds click handlers to pool assets.
   */
  bindPoolTableEvents: function(selector) {
    // Pool click handlers
    $(selector + ' tbody tr').click(async function() {
      // Set pool name
      $('.pool-detailed-name').text($(this).data("name"));

      // Add assets to tables
      var comptroller = $(this).data("comptroller");
      var cTokens = await App.contracts.FusePoolDirectory.methods.getPoolAssetsWithData(comptroller).call({ from: App.selectedAccount });
      var html = '';
      for (var i = 0; i < cTokens.length; i++) {
        var underlyingDecimals = parseInt(cTokens[i].underlyingDecimals);
        html += '<tr data-ctoken="' + cTokens[i].cToken + '" data-underlying="' + cTokens[i].underlyingToken + '" data-symbol="' + cTokens[i].underlyingSymbol + '" data-decimals="' + cTokens[i].underlyingDecimals + '"><td scope="row">' + cTokens[i].underlyingName + '</td><td>' + cTokens[i].underlyingSymbol + '</td><td>' + (new Big(cTokens[i].supplyRatePerBlock)).mul(2372500).div(1e16).toFormat(2) + '</td><td>' + (new Big(cTokens[i].totalSupply)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].supplyBalance)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].underlyingBalance)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input collateral-switch" data-comptroller="' + comptroller + '" id="collateral-switch-' + (i + 1) + '"' + (cTokens[i].membership ? " checked" : "") + '><label class="custom-control-label" for="collateral-switch-' + (i + 1) + '">Collateral</label></div></td><td><button type="button" class="btn btn-success btn-sm button-deposit">Deposit</button><button type="button" class="btn btn-danger btn-sm button-withdraw">Withdraw</button></td></tr>';
      }
      $('.pool-detailed-table-assets-supply tbody').html(html);
      html = '';
      for (var i = 0; i < cTokens.length; i++) {
        var underlyingDecimals = parseInt(cTokens[i].underlyingDecimals);
        html += '<tr data-ctoken="' + cTokens[i].cToken + '" data-underlying="' + cTokens[i].underlyingToken + '" data-symbol="' + cTokens[i].underlyingSymbol + '" data-decimals="' + cTokens[i].underlyingDecimals + '"><td scope="row">' + cTokens[i].underlyingName + '</td><td>' + cTokens[i].underlyingSymbol + '</td><td>' + (new Big(cTokens[i].borrowRatePerBlock)).mul(2372500).div(1e16).toFormat(2) + '</td><td>' + (new Big(cTokens[i].totalBorrow)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].borrowBalance)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].underlyingBalance)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + (new Big(cTokens[i].liquidity)).div((new Big(10)).pow(underlyingDecimals)).toFormat(4) + '</td><td><button type="button" class="btn btn-warning btn-sm button-borrow">Borrow</button><button type="button" class="btn btn-primary btn-sm button-repay">Repay</button></td></tr>';
      }
      $('.pool-detailed-table-assets-borrow tbody').html(html);

      // Unhealthy accounts table
      var data = await App.contracts.FusePoolDirectory.methods.getPoolUsersWithData(comptroller, Web3.utils.toBN(1e18)).call();
      var borrowers = data["0"];
      borrowers.sort((a, b) => parseInt(b.totalBorrow) - parseInt(a.totalBorrow));
      var closeFactor = (new Big(data["1"])).div(1e18);
      var liquidationIncentive = (new Big(data["2"])).div(1e18);
      var html = '';

      for (var borrower of borrowers) {
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

        borrower.debt.sort((a, b) => b.borrowBalanceEth.gt(a.borrowBalanceEth));
        borrower.collateral.sort((a, b) => b.supplyBalanceEth.gt(a.supplyBalanceEth));

        borrower.predictions = [];

        borrower.maxLiquidationValue = new Big(borrower.totalBorrow).mul(closeFactor).div(1e18);
        const underlyingDebtPrice = (new Big(borrower.debt[0].underlyingPrice)).div((new Big(10)).pow(36 - borrower.debt[0].underlyingDecimals));
        const underlyingCollateralPrice = (new Big(borrower.collateral[0].underlyingPrice)).div((new Big(10)).pow(36 - borrower.collateral[0].underlyingDecimals));
        const liquidationAmount = borrower.maxLiquidationValue.div(underlyingDebtPrice);
        const seizeAmountEth = borrower.maxLiquidationValue.mul(liquidationIncentive);
        const seizeAmount = seizeAmountEth.div(underlyingCollateralPrice);
        borrower.predictions.push("Liquidate " + liquidationAmount.toFormat(8) + " " + borrower.debt[0].underlyingSymbol + " (" + borrower.maxLiquidationValue.toFormat(8) + " ETH) debt");
        borrower.predictions.push("Collect " + seizeAmount.toFormat(8) + borrower.collateral[0].underlyingSymbol + " (" + seizeAmountEth.toFormat(8) + " ETH) collateral");

        const expectedCollateral = seizeAmountEth;
        const actualCollateral = (new Big(borrower.collateral[0].supplyBalance)).mul(borrower.collateral[0].underlyingPrice).div(1e36);
        var minSeizeAmount = new Big(0);
        
        if (expectedCollateral.gt(actualCollateral)) {
          borrower.predictions.push('Insufficient collateral.');
        } else {
          let expectedGasAmount = 0;

          try {
            if (borrower.debt[0].underlyingSymbol === 'ETH') {
              expectedGasAmount = await App.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, borrower.debt[0].cToken, borrower.collateral[0].cToken, 0, borrower.collateral[0].cToken).estimateGas({ gas: 1e9, value: liquidationAmount.mul((new Big(10)).pow(parseInt(borrower.debt[0].underlyingDecimals))).toFixed(0), from: App.selectedAccount });
            } else {
              expectedGasAmount = await App.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, liquidationAmount.mul((new Big(10)).pow(parseInt(borrower.debt[0].underlyingDecimals))).toFixed(0), borrower.debt[0].cToken, borrower.collateral[0].cToken, 0, borrower.collateral[0].cToken).estimateGas({ gas: 1e9, from: App.selectedAccount });
            }
          } catch {
            expectedGasAmount = 600000;
          }

          const gasPrice = new Big(await App.web3.eth.getGasPrice()).div(1e18);
          const expectedGasFee = gasPrice.mul(expectedGasAmount);
          borrower.predictions.push("Gas Amount = " + expectedGasAmount + ", Gas Fee = " + expectedGasFee.toFormat(8) + " ETH");
          const expectedRevenue = seizeAmount.mul(underlyingCollateralPrice).sub(liquidationAmount.mul(underlyingDebtPrice));
          borrower.predictions.push("Expected Revenue = " + expectedRevenue.toFormat(8) + "ETH");
          const expectedProfit = expectedRevenue.sub(expectedGasFee);
          borrower.predictions.push("Expected Profit = " + expectedProfit.toFormat(8) + "ETH");

          // We want expectedProfit = 0, so expectedRevenue = expectedGasFee
          minSeizeAmount = expectedGasFee.add(liquidationAmount.mul(underlyingDebtPrice)).div(underlyingCollateralPrice);
        }
        
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
        $('#modal-deposit #DepositCurrencySymbol option').text($(this).closest('tr').data("symbol"));
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
          $(this).val() === "other" ? $('#LiquidateExchangeProfitTo').show() : $('#LiquidateExchangeProfitTo').hide();
        });

        $('#modal-liquidate #liquidateButton').off('click').click(async function() {
          // Validate amount
          var amount = $('#LiquidateAmount').val();
          if (!amount) return toastr["error"]("Invalid liquidation amount.", "Liquidation failed");
          amount = Web3.utils.toBN((new Big(amount)).mul((new Big(10)).pow(underlyingDebtDecimals)).toFixed(0));

          // Validate exchangeProfitTo
          var exchangeProfitTo = $('#modal-liquidate #LiquidateProfitCurrencySymbol').val();
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
          var liquidateMethod = $('#modal-liquidate #LiquidateMethod').val();

          if (liquidateMethod === "uniswap") {
            // Liquidate via flashloan
            var minProfit = $('#LiquidateMinProfit').val();
            if (!minProfit) minProfit = Web3.utils.toBN(0);
            else minProfit = Web3.utils.toBN((new Big(minProfit)).mul((new Big(10)).pow(exchangeProfitToDecimals)).toFixed(0));

            try {
              await (underlyingDebtSymbol === "ETH" ? App.contracts.FuseSafeLiquidator.methods.safeLiquidateToEthWithFlashLoan(borrower.account, amount, debtCToken, collateralCToken, minProfit, exchangeProfitTo).send({ from: App.selectedAccount }) : App.contracts.FuseSafeLiquidator.methods.safeLiquidateToTokensWithFlashLoan(borrower.account, amount, debtCToken, collateralCToken, minProfit, exchangeProfitTo).send({ from: App.selectedAccount }));
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
                await debtToken.methods.approve(App.contracts.FuseSafeLiquidator.options.address, amount).send({ from: App.selectedAccount });
              } catch (error) {
                return toastr["error"]("Approval failed: " + (error.message ? error.message : error), "Liquidation failed");
              }
            }

            try {
              await (underlyingDebtSymbol === "ETH" ? App.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, debtCToken, collateralCToken, minSeize, exchangeProfitTo).send({ from: App.selectedAccount, value: amount }) : App.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, amount, debtCToken, collateralCToken, minSeize, exchangeProfitTo).send({ from: App.selectedAccount }));
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
