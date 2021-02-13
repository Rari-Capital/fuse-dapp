function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Unpackage imports
var Web3Modal = window.Web3Modal.default;
var WalletConnectProvider = window.WalletConnectProvider.default;
var EvmChains = window.EvmChains;
var Fortmatic = window.Fortmatic;
var Torus = window.Torus;
var Portis = window.Portis;
var Authereum = window.Authereum; // Enable Big.toFormat and set rounding mode to round down

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
  init: function init() {
    if (location.hash === "#deploy") {
      $('#page-pools').hide();
      $('#page-pool').hide();
      $('#page-deploy').show();
      $('#tab-pools').css('text-decoration', '');
      $('#tab-deploy').css('text-decoration', 'underline');
    }

    $('#tab-pools').click(function () {
      $('#page-pool, #page-deploy, #page-liquidations').hide();
      $('#page-pools').show();
      $('#tab-deploy, #tab-liquidations').css('text-decoration', '');
      $('#tab-pools').css('text-decoration', 'underline');
    });
    $('#tab-deploy').click(function () {
      $('#page-pools, #page-pool, #page-liquidations').hide();
      $('#page-deploy').show();
      $('#tab-pools, #tab-liquidations').css('text-decoration', '');
      $('#tab-deploy').css('text-decoration', 'underline');
    });
    $('#tab-liquidations').click(function () {
      $('#page-pools, #page-pool, #page-deploy').hide();
      $('#page-liquidations').show();
      $('#tab-pools, #tab-deploy').css('text-decoration', '');
      $('#tab-liquidations').css('text-decoration', 'underline');
    });
    App.initChartColors();
    App.initWeb3();
    App.bindEvents();
  },
  initChartColors: function initChartColors() {
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
  initWeb3Modal: function initWeb3Modal() {
    var providerOptions = {
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
      cacheProvider: false,
      // optional
      providerOptions: providerOptions // required

    });
  },

  /**
   * Kick in the UI action after Web3modal dialog has chosen a provider
   */
  fetchAccountData: function () {
    var _fetchAccountData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var chainId, i;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // Get a Web3 instance for the wallet
              App.web3 = new Web3(App.web3Provider); // Get connected chain ID from Ethereum node

              _context.next = 3;
              return App.web3.eth.getChainId();

            case 3:
              chainId = _context.sent;
              _context.next = 6;
              return App.web3.eth.getAccounts();

            case 6:
              App.accounts = _context.sent;
              App.selectedAccount = App.accounts[0]; // Mixpanel

              if (typeof mixpanel !== 'undefined') {
                mixpanel.identify(App.selectedAccount);
                mixpanel.people.set({
                  "Ethereum Address": App.selectedAccount,
                  "App Version": "0.1.0"
                });
              } // Get user's account balance in the stablecoin fund, RFT balance, and account balance limit
              // TODO: Below


              App.getMyFusePools();
              if (!App.intervalGetMyFusePools) App.intervalGetMyFusePools = setInterval(App.getMyFusePools, 5 * 60 * 1000); // Load acounts dropdown

              $('#selected-account').empty();

              for (i = 0; i < App.accounts.length; i++) {
                $('#selected-account').append('<option' + (i == 0 ? ' selected' : '') + '>' + App.accounts[i] + '</option>');
              } // Display fully loaded UI for wallet data


              $('#deployPoolButton, #deployAssetButton').prop("disabled", false);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    function fetchAccountData() {
      return _fetchAccountData.apply(this, arguments);
    }

    return fetchAccountData;
  }(),

  /**
   * Fetch account data for UI when
   * - User switches accounts in wallet
   * - User switches networks in wallet
   * - User connects wallet initially
   */
  refreshAccountData: function () {
    var _refreshAccountData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // If any current data is displayed when
              // the user is switching acounts in the wallet
              // immediate hide this data
              $('.pools-table-private tbody').html('<tr colspan="7">Loading my Fuse pools...</td>');
              $('#DeployAssetPool').html('<option selected disabled>Loading pools...</option>'); // Disable button while UI is loading.
              // fetchAccountData() will take a while as it communicates
              // with Ethereum node via JSON-RPC and loads chain data
              // over an API call.

              $(".btn-connect").text("Loading...");
              $(".btn-connect").prop("disabled", true);
              _context2.next = 6;
              return App.fetchAccountData();

            case 6:
              $(".btn-connect").hide();
              $(".btn-connect").text("Connect Wallet");
              $(".btn-connect").prop("disabled", false);
              $("#btn-disconnect").show();
              $('.show-account').show();

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    function refreshAccountData() {
      return _refreshAccountData.apply(this, arguments);
    }

    return refreshAccountData;
  }(),

  /**
   * Connect wallet button pressed.
   */
  connectWallet: function () {
    var _connectWallet = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // Setting this null forces to show the dialogue every time
              // regardless if we play around with a cacheProvider settings
              // in our localhost.
              // TODO: A clean API needed here
              App.web3Modal.providerController.cachedProvider = null;
              _context3.prev = 1;
              _context3.next = 4;
              return App.web3Modal.connect();

            case 4:
              App.web3Provider = _context3.sent;
              _context3.next = 11;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3["catch"](1);
              console.error("Could not get a wallet connection", _context3.t0);
              return _context3.abrupt("return");

            case 11:
              App.fuse = new Fuse(App.web3Provider);

              if (App.web3Provider.on) {
                // Subscribe to accounts change
                App.web3Provider.on("accountsChanged", function (accounts) {
                  App.fetchAccountData();
                }); // Subscribe to chainId change

                App.web3Provider.on("chainChanged", function (chainId) {
                  App.fetchAccountData();
                }); // Subscribe to networkId change

                App.web3Provider.on("networkChanged", function (networkId) {
                  App.fetchAccountData();
                });
              }

              _context3.next = 15;
              return App.refreshAccountData();

            case 15:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 7]]);
    }));

    function connectWallet() {
      return _connectWallet.apply(this, arguments);
    }

    return connectWallet;
  }(),

  /**
   * Disconnect wallet button pressed.
   */
  disconnectWallet: function () {
    var _disconnectWallet = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              console.log("Killing the wallet connection", App.web3Provider); // TODO: MetamaskInpageProvider does not provide disconnect?

              if (!App.web3Provider.close) {
                _context4.next = 5;
                break;
              }

              _context4.next = 4;
              return App.web3Provider.close();

            case 4:
              App.web3Provider = null;

            case 5:
              App.selectedAccount = null; // Set the UI back to the initial state

              $("#selected-account").html('<option disabled selected>Please connect your wallet...</option>');
              $('.show-account').hide();
              $("#btn-disconnect").hide();
              $(".btn-connect").show();
              $('.pools-table-private tbody').html('<tr colspan="7">Wallet not connected.</td>');

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    function disconnectWallet() {
      return _disconnectWallet.apply(this, arguments);
    }

    return disconnectWallet;
  }(),

  /**
   * Initialize the latest version of web3.js (MetaMask uses an oudated one that overwrites ours if we include it as an HTML tag), then initialize and connect Web3Modal.
   */
  initWeb3: function initWeb3() {
    $.getScript("js/web3.min.js", function () {
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
  initContracts: function initContracts() {
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
  bindEvents: function bindEvents() {
    $(document).on('click', '.btn-connect', App.connectWallet);
    $(document).on('click', '#btn-disconnect', App.disconnectWallet);
    $(document).on('change', '#selected-account', function () {
      // Set selected account
      App.selectedAccount = $(this).val(); // Mixpanel

      if (typeof mixpanel !== 'undefined') {
        mixpanel.identify(App.selectedAccount);
        mixpanel.people.set({
          "Ethereum Address": App.selectedAccount,
          "App Version": "0.1.0"
        });
      } // Get user's Fuse pools


      App.getMyFusePools();
    });
    $(document).on('change', '#DeployAssetPool, #DeployAssetUnderlying', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var token, symbol;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!($('#DeployAssetPool').val() && $('#DeployAssetUnderlying').val().length > 0)) {
                _context5.next = 13;
                break;
              }

              token = new App.web3.eth.Contract(App.erc20Abi, $('#DeployAssetUnderlying').val());
              _context5.prev = 2;
              _context5.next = 5;
              return token.methods.symbol().call();

            case 5:
              symbol = _context5.sent;
              _context5.next = 11;
              break;

            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5["catch"](2);
              return _context5.abrupt("return");

            case 11:
              $('#DeployAssetName').val($('#DeployAssetPool option:selected').text() + " " + symbol);
              $('#DeployAssetSymbol').val("f" + symbol);

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[2, 8]]);
    })));
    $(document).on('change', '#DeployPoolPriceOracle', function () {
      $('#DeployPoolPriceOracle').val() && $('#DeployPoolPriceOracle').val().length > 0 ? $('#DeployPoolPriceOracleOtherWrapper').hide() : $('#DeployPoolPriceOracleOtherWrapper').show();
    });
    $(document).on('change', '#DeployAssetInterestRateModel', function () {
      $('#DeployAssetInterestRateModel').val() && $('#DeployAssetInterestRateModel').val().length > 0 ? $('#DeployAssetInterestRateModelOtherWrapper').hide() : $('#DeployAssetInterestRateModelOtherWrapper').show();
    });
    $(document).on('click', '#deployPoolButton', App.handleDeployPool);
    $(document).on('click', '#deployAssetButton', App.handleDeployAsset);
  },

  /**
   * Deploys a new Fuse pool.
   */
  handleDeployPool: function () {
    var _handleDeployPool = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(event) {
      var poolName, closeFactor, maxAssets, liquidationIncentive, priceOracle, reporter, isPrivate;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              event.preventDefault();
              poolName = $('#DeployPoolName').val();
              closeFactor = $('#DeployPoolCloseFactor').val();
              if (closeFactor === "") closeFactor = Web3.utils.toBN(0.5e18);else closeFactor = Web3.utils.toBN(new Big(closeFactor).mul(new Big(10).pow(18)).toFixed(0));
              maxAssets = $('#DeployPoolMaxAssets').val();
              if (maxAssets === "") maxAssets = 20;
              liquidationIncentive = $('#DeployPoolLiquidationIncentive').val();
              if (liquidationIncentive === "") liquidationIncentive = Web3.utils.toBN(1.08e18);else liquidationIncentive = Web3.utils.toBN(new Big(liquidationIncentive).mul(new Big(10).pow(18)).toFixed(0));
              priceOracle = $('#DeployPoolPriceOracle').val() && $('#DeployPoolPriceOracle').val().length > 0 ? $('#DeployPoolPriceOracle').val() : $('#DeployPoolPriceOracleOther').val(); // TODO: Correct public PreferredPriceOracle and public UniswapView addresses

              if (priceOracle === "PreferredPriceOracle" && Fuse.PUBLIC_PREFERRED_PRICE_ORACLE_CONTRACT_ADDRESS && confirm("Would you like to use the public PreferredPriceOracle? There is no reason to say no unless you need to use SushiSwap (or another Uniswap V2 fork) or you need to set fixed prices for tokens other than WETH.")) priceOracle = Fuse.PUBLIC_PREFERRED_PRICE_ORACLE_CONTRACT_ADDRESS;
              if (priceOracle === "UniswapView" && Fuse.PUBLIC_UNISWAP_VIEW_CONTRACT_ADDRESS && confirm("Would you like to use the public UniswapView? There is no reason to say no unless you need to use SushiSwap (or another Uniswap V2 fork) or you need to set fixed prices for tokens other than WETH.")) priceOracle = Fuse.PUBLIC_UNISWAP_VIEW_CONTRACT_ADDRESS;
              if (priceOracle === "UniswapAnchoredView" && Fuse.PUBLIC_UNISWAP_ANCHORED_VIEW_CONTRACT_ADDRESS && confirm("Would you like to use the public UniswapAnchoredView? Say yes to use Coinbase Pro as a reporter, and say no to user another price oracle as a reporter.")) priceOracle = Fuse.PUBLIC_UNISWAP_ANCHORED_VIEW_CONTRACT_ADDRESS;
              reporter = null;
              if (priceOracle === "UniswapAnchoredView") reporter = prompt("What reporter address would you like to use? (Coinbase Pro is the default.)", "0xfCEAdAFab14d46e20144F48824d0C09B1a03F2BC");
              isPrivate = parseInt($('#DeployPoolPrivate').val()) > 0;
              $('#deployPoolButton').prop("disabled", true).html('<div class="loading-icon"><div></div><div></div><div></div></div>');
              _context7.next = 18;
              return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                var _yield$App$fuse$deplo, _yield$App$fuse$deplo2, poolAddress, implementationAddress, priceOracleAddress;

                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return App.fuse.deployPool(poolName, isPrivate, closeFactor, maxAssets, liquidationIncentive, priceOracle, {
                          reporter: reporter
                        }, {
                          from: App.selectedAccount
                        });

                      case 3:
                        _yield$App$fuse$deplo = _context6.sent;
                        _yield$App$fuse$deplo2 = _slicedToArray(_yield$App$fuse$deplo, 3);
                        poolAddress = _yield$App$fuse$deplo2[0];
                        implementationAddress = _yield$App$fuse$deplo2[1];
                        priceOracleAddress = _yield$App$fuse$deplo2[2];
                        _context6.next = 13;
                        break;

                      case 10:
                        _context6.prev = 10;
                        _context6.t0 = _context6["catch"](0);
                        return _context6.abrupt("return", toastr["error"]("Deployment of new Fuse pool failed: " + (_context6.t0.message ? _context6.t0.message : _context6.t0), "Deployment failed"));

                      case 13:
                        // Mixpanel
                        if (typeof mixpanel !== 'undefined') mixpanel.track("Pool deployed", {
                          poolAddress: poolAddress,
                          implementationAddress: implementationAddress,
                          priceOracleAddress: priceOracleAddress,
                          poolName: poolName,
                          isPrivate: isPrivate,
                          closeFactor: closeFactor,
                          maxAssets: maxAssets,
                          liquidationIncentive: liquidationIncentive,
                          priceOracle: priceOracle
                        }); // Alert success and refresh balances

                        toastr["success"]("Deployment of new Fuse pool confirmed! Contract address: " + poolAddress, "Deployment successful");
                        App.getFusePools();
                        App.getMyFusePools();

                      case 17:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6, null, [[0, 10]]);
              }))();

            case 18:
              $('#deployPoolButton').text("Deploy");
              $('#deployPoolButton').prop("disabled", false);

            case 20:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));

    function handleDeployPool(_x) {
      return _handleDeployPool.apply(this, arguments);
    }

    return handleDeployPool;
  }(),

  /**
   * Deploys a new asset to an existing Fuse pool.
   */
  handleDeployAsset: function () {
    var _handleDeployAsset = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(event) {
      var conf, collateralFactor, reserveFactor, adminFee;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              event.preventDefault();
              conf = {
                underlying: $('#DeployAssetUnderlying').val(),
                comptroller: $('#DeployAssetPool').val(),
                interestRateModel: $('#DeployAssetInterestRateModel').val() && $('#DeployAssetInterestRateModel').val().length > 0 ? $('#DeployAssetInterestRateModel').val() : $('#DeployAssetInterestRateModelOther').val(),
                initialExchangeRateMantissa: Web3.utils.toBN(1e18),
                name: $('#DeployAssetName').val(),
                symbol: $('#DeployAssetSymbol').val(),
                decimals: $('#DeployAssetDecimals').val() !== "" ? $('#DeployAssetDecimals').val() : 8,
                admin: App.selectedAccount // TODO: Flexible?

              };
              collateralFactor = $('#DeployAssetCollateralFactor').val();
              if (collateralFactor === "") collateralFactor = Web3.utils.toBN(0.75e18);else collateralFactor = Web3.utils.toBN(new Big(collateralFactor).mul(new Big(10).pow(18)).toFixed(0));
              reserveFactor = $('#DeployAssetReserveFactor').val();
              if (reserveFactor === "") reserveFactor = Web3.utils.toBN(0.2e18);else reserveFactor = Web3.utils.toBN(new Big(reserveFactor).mul(new Big(10).pow(18)).toFixed(0));
              adminFee = $('#DeployAssetAdminFee').val();
              if (adminFee === "") adminFee = Web3.utils.toBN(0);else adminFee = Web3.utils.toBN(new Big(adminFee).mul(new Big(10).pow(18)).toFixed(0));
              $('#deployAssetButton').prop("disabled", true).html('<div class="loading-icon"><div></div><div></div><div></div></div>');
              _context9.next = 11;
              return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                var _i2, _arr2, possibleModel, openParenIndex, interestRateModelConfArray, interestRateModelConf, _yield$App$fuse$deplo3, _yield$App$fuse$deplo4, assetAddress, implementationAddress, interestRateModel;

                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _i2 = 0, _arr2 = ["WhitePaperInterestRateModel", "JumpRateModel", "DAIInterestRateModelV2"];

                      case 1:
                        if (!(_i2 < _arr2.length)) {
                          _context8.next = 41;
                          break;
                        }

                        possibleModel = _arr2[_i2];

                        if (!(conf.interestRateModel.indexOf(possibleModel) === 0)) {
                          _context8.next = 38;
                          break;
                        }

                        if (!(conf.interestRateModel[conf.interestRateModel.length - 1] === ")")) {
                          _context8.next = 19;
                          break;
                        }

                        // Get config from inside parentheses
                        openParenIndex = conf.interestRateModel.indexOf("(");
                        interestRateModelConfArray = conf.interestRateModel.substr(openParenIndex + 1, conf.interestRateModel.length - openParenIndex - 2).split(",");
                        conf.interestRateModel = conf.interestRateModel.substr(0, openParenIndex);
                        _context8.t0 = conf.interestRateModel;
                        _context8.next = _context8.t0 === "WhitePaperInterestRateModel" ? 11 : _context8.t0 === "JumpRateModel" ? 13 : _context8.t0 === "DAIInterestRateModelV2" ? 15 : 17;
                        break;

                      case 11:
                        interestRateModelConf = {
                          baseRatePerYear: Math.trunc(Number(interestRateModelConfArray[0])).toString(),
                          multiplierPerYear: Math.trunc(Number(interestRateModelConfArray[1])).toString()
                        };
                        return _context8.abrupt("break", 17);

                      case 13:
                        interestRateModelConf = {
                          baseRatePerYear: Math.trunc(Number(interestRateModelConfArray[0])).toString(),
                          multiplierPerYear: Math.trunc(Number(interestRateModelConfArray[1])).toString(),
                          jumpMultiplierPerYear: Math.trunc(Number(interestRateModelConfArray[2])).toString(),
                          kink: Math.trunc(Number(interestRateModelConfArray[3])).toString()
                        };
                        return _context8.abrupt("break", 17);

                      case 15:
                        interestRateModelConf = {
                          jumpMultiplierPerYear: Math.trunc(Number(interestRateModelConfArray[0])).toString(),
                          kink: Math.trunc(Number(interestRateModelConfArray[1])).toString()
                        };
                        return _context8.abrupt("break", 17);

                      case 17:
                        _context8.next = 28;
                        break;

                      case 19:
                        _context8.t1 = conf.interestRateModel;
                        _context8.next = _context8.t1 === "WhitePaperInterestRateModel" ? 22 : _context8.t1 === "JumpRateModel" ? 24 : _context8.t1 === "DAIInterestRateModelV2" ? 26 : 28;
                        break;

                      case 22:
                        interestRateModelConf = {
                          baseRatePerYear: Math.trunc(prompt("Please enter the base borrow rate per year for your new WhitePaperInterestRateModel:") * 1e18).toString(),
                          multiplierPerYear: Math.trunc(prompt("Please enter the slope of the borrow rate per year over utilization rate for your new WhitePaperInterestRateModel:") * 1e18).toString()
                        };
                        return _context8.abrupt("break", 28);

                      case 24:
                        interestRateModelConf = {
                          baseRatePerYear: Math.trunc(prompt("Please enter the base borrow rate per year for your new JumpRateModel:") * 1e18).toString(),
                          multiplierPerYear: Math.trunc(prompt("Please enter the slope of the borrow rate per year over utilization rate for your new JumpRateModel:") * 1e18).toString(),
                          jumpMultiplierPerYear: Math.trunc(prompt("Please enter the jump slope (kicks in after the kink) of the borrow rate per year over utilization rate for your new JumpRateModel:") * 1e18).toString(),
                          kink: Math.trunc(prompt("Please enter the kink point (utilization rate above which the jump slope kicks in) for your new JumpRateModel:") * 1e18).toString()
                        };
                        return _context8.abrupt("break", 28);

                      case 26:
                        interestRateModelConf = {
                          jumpMultiplierPerYear: Math.trunc(prompt("Please enter the jump slope (kicks in after the kink) of the borrow rate per year over utilization rate for your new DAIInterestRateModelV2:") * 1e18).toString(),
                          kink: Math.trunc(prompt("Please enter the kink point (utilization rate above which the jump slope kicks in) for your new DAIInterestRateModelV2:") * 1e18).toString()
                        };
                        return _context8.abrupt("break", 28);

                      case 28:
                        _context8.prev = 28;
                        _context8.next = 31;
                        return App.fuse.deployInterestRateModel(conf.interestRateModel, interestRateModelConf, {
                          from: App.selectedAccount
                        });

                      case 31:
                        conf.interestRateModel = _context8.sent;
                        _context8.next = 37;
                        break;

                      case 34:
                        _context8.prev = 34;
                        _context8.t2 = _context8["catch"](28);
                        return _context8.abrupt("return", toastr["error"]("Deployment of new interest rate model failed: " + (_context8.t2.message ? _context8.t2.message : _context8.t2), "Deployment failed"));

                      case 37:
                        return _context8.abrupt("break", 41);

                      case 38:
                        _i2++;
                        _context8.next = 1;
                        break;

                      case 41:
                        _context8.prev = 41;
                        _context8.next = 44;
                        return App.fuse.deployAsset(conf, collateralFactor, reserveFactor, adminFee, {
                          from: App.selectedAccount
                        });

                      case 44:
                        _yield$App$fuse$deplo3 = _context8.sent;
                        _yield$App$fuse$deplo4 = _slicedToArray(_yield$App$fuse$deplo3, 3);
                        assetAddress = _yield$App$fuse$deplo4[0];
                        implementationAddress = _yield$App$fuse$deplo4[1];
                        interestRateModel = _yield$App$fuse$deplo4[2];
                        _context8.next = 54;
                        break;

                      case 51:
                        _context8.prev = 51;
                        _context8.t3 = _context8["catch"](41);
                        return _context8.abrupt("return", toastr["error"]("Deployment of asset to Fuse pool failed: " + (_context8.t3.message ? _context8.t3.message : _context8.t3), "Deployment failed"));

                      case 54:
                        // Mixpanel
                        if (typeof mixpanel !== 'undefined') mixpanel.track("Asset deployed to pool", _objectSpread(_objectSpread({}, conf), {}, {
                          assetAddress: assetAddress,
                          implementationAddress: implementationAddress,
                          interestRateModel: interestRateModel,
                          collateralFactor: collateralFactor,
                          reserveFactor: reserveFactor,
                          adminFee: adminFee
                        })); // Alert success and refresh balances

                        toastr["success"]("Deployment of asset to Fuse pool confirmed! Contract address: " + assetAddress, "Deployment successful");

                      case 56:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8, null, [[28, 34], [41, 51]]);
              }))();

            case 11:
              $('#deployAssetButton').text("Deploy");
              $('#deployAssetButton').prop("disabled", false);

            case 13:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));

    function handleDeployAsset(_x2) {
      return _handleDeployAsset.apply(this, arguments);
    }

    return handleDeployAsset;
  }(),

  /**
   * Gets all public Fuse pools in the directory.
   */
  getFusePools: function () {
    var _getFusePools = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
      var data, indexes, pools, totalSupplyEth, totalBorrowEth, html, i;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              console.log('Getting all Fuse pools...');
              _context10.prev = 1;
              _context10.next = 4;
              return App.fuse.contracts.FusePoolDirectory.methods.getPublicPoolsWithData().call();

            case 4:
              data = _context10.sent;
              _context10.next = 10;
              break;

            case 7:
              _context10.prev = 7;
              _context10.t0 = _context10["catch"](1);
              return _context10.abrupt("return", console.error(_context10.t0));

            case 10:
              indexes = data["0"];
              pools = data["1"];
              totalSupplyEth = data["2"];
              totalBorrowEth = data["3"];
              html = '';

              for (i = 0; i < pools.length; i++) {
                html += '<tr data-id="' + indexes[i] + '" data-name="' + pools[i].name + '" data-comptroller="' + pools[i].comptroller + '" data-creator="' + pools[i].creator + '" data-privacy="' + (pools[i].isPrivate ? 1 : 0) + '"><td scope="row">#' + (i + 1) + '</td><td><a href="https://etherscan.io/address/' + pools[i].comptroller + '">' + pools[i].name + '</a></td><td><a href="https://etherscan.io/address/' + pools[i].creator + '">' + pools[i].creator + '</a></td><td>' + new Big(totalSupplyEth[i]).div(1e18).toFormat(4) + ' ETH</td><td>' + new Big(totalBorrowEth[i]).div(1e18).toFormat(4) + ' ETH</td><td class="text-danger">Unverified</td><td class="text-right" data-toggle="tooltip" data-placement="bottom" title="' + new Date(pools[i].timestampPosted * 1000).toISOString() + '">' + timeago.format(pools[i].timestampPosted * 1000) + '</td></tr>';
              }

              $('.pools-table-public tbody').html(html);
              $('.pools-table-public [data-toggle="tooltip"]').tooltip(); // Add pool asset click handlers

              App.bindPoolTableEvents('.pools-table-public');

            case 19:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, null, [[1, 7]]);
    }));

    function getFusePools() {
      return _getFusePools.apply(this, arguments);
    }

    return getFusePools;
  }(),

  /**
   * Gets the user's deployed Fuse pools in the directory.
   */
  getMyFusePools: function () {
    var _getMyFusePools = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
      var data, indexes, pools, totalSupplyEth, totalBorrowEth, html, i;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              console.log('Getting my Fuse pools...');
              _context11.prev = 1;
              _context11.next = 4;
              return App.fuse.contracts.FusePoolDirectory.methods.getPoolsByAccountWithData(App.selectedAccount).call();

            case 4:
              data = _context11.sent;
              _context11.next = 10;
              break;

            case 7:
              _context11.prev = 7;
              _context11.t0 = _context11["catch"](1);
              return _context11.abrupt("return", console.error(_context11.t0));

            case 10:
              indexes = data["0"];
              pools = data["1"];
              totalSupplyEth = data["2"];
              totalBorrowEth = data["3"];
              html = '';

              for (i = 0; i < pools.length; i++) {
                html += '<tr data-id="' + indexes[i] + '" data-name="' + pools[i].name + '" data-comptroller="' + pools[i].comptroller + '" data-creator="' + App.selectedAccount + '" data-privacy="' + (pools[i].isPrivate ? 1 : 0) + '"><td scope="row">#' + (i + 1) + '</td><td><a href="https://etherscan.io/address/' + pools[i].comptroller + '">' + pools[i].name + '</a></td><td>' + new Big(totalSupplyEth[i]).div(1e18).toFormat(4) + ' ETH</td><td>' + new Big(totalBorrowEth[i]).div(1e18).toFormat(4) + ' ETH</td><td>' + (pools[i].isPrivate ? "Private" : "Public") + '</td><td class="text-danger">Unverified</td><td class="text-right" data-toggle="tooltip" data-placement="bottom" title="' + new Date(pools[i].timestampPosted * 1000).toISOString() + '">' + timeago.format(pools[i].timestampPosted * 1000) + '</td></tr>';
              }

              $('.pools-table-private tbody').html(html);
              $('.pools-table-private [data-toggle="tooltip"]').tooltip();
              html = '<option selected disabled>Select a pool...</option>';

              for (i = 0; i < pools.length; i++) {
                html += '<option value="' + pools[i].comptroller + '" data-id="' + indexes[i] + '">' + pools[i].name + '</option>';
              }

              $('#DeployAssetPool').html(html); // Add pool asset click handlers

              App.bindPoolTableEvents('.pools-table-private');

            case 22:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, null, [[1, 7]]);
    }));

    function getMyFusePools() {
      return _getMyFusePools.apply(this, arguments);
    }

    return getMyFusePools;
  }(),

  /**
   * Displays a chart with interest rates by utilization rate.
   */
  initInterestRateModelChart: function initInterestRateModelChart(borrowerRates, supplierRates) {
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
          pointRadius: 0
        }, {
          label: 'Supplier Rate',
          backgroundColor: color("rgb(54, 162, 235)").alpha(0.5).rgbString(),
          borderColor: "rgb(54, 162, 235)",
          data: supplierRates,
          pointRadius: 0
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
              labelString: 'APY (%)'
            }
          }]
        },
        tooltips: {
          intersect: false,
          mode: 'index',
          callbacks: {
            title: function title(tooltipItems, myData) {
              return "Utilization: " + tooltipItems[0].xLabel + "%";
            },
            label: function label(tooltipItem, myData) {
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
  bindPoolTableEvents: function bindPoolTableEvents(selector) {
    // Pool click handlers
    $(selector + ' tbody tr').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24() {
      var comptroller, comptrollerInstance, priceOracle, priceOracleContractName, potentialName, cTokens, html, i, underlyingDecimals, data, borrowers, closeFactor, liquidationIncentive, _iterator, _step, borrower, _iterator2, _step2, asset, underlyingDebtPrice, underlyingCollateralPrice, debtAmount, liquidationAmount, liquidationValueEth, seizeAmountEth, seizeAmount, actualCollateral, expectedGasAmount, gasPrice, expectedGasFee, expectedRevenue, expectedProfit, minSeizeAmount;

      return regeneratorRuntime.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              // Set pool name
              $('.pool-detailed-name').text($(this).data("name")); // Get comptroller address and contract

              comptroller = $(this).data("comptroller");
              comptrollerInstance = new App.web3.eth.Contract(App.comptrollerAbi, comptroller); // Get price oracle contract name and type

              _context24.next = 5;
              return comptrollerInstance.methods.oracle().call();

            case 5:
              priceOracle = _context24.sent;
              priceOracleContractName = priceOracle;

              if (!(priceOracle == Fuse.PUBLIC_CHAINLINK_PRICE_ORACLE_CONTRACT_ADDRESS)) {
                _context24.next = 11;
                break;
              }

              priceOracleContractName = "\u2714\uFE0F ChainlinkPriceOracle";
              _context24.next = 23;
              break;

            case 11:
              if (!(priceOracle == Fuse.PUBLIC_UNISWAP_VIEW_CONTRACT_ADDRESS)) {
                _context24.next = 15;
                break;
              }

              priceOracleContractName = "\u26A0\uFE0F UniswapView - Public";
              _context24.next = 23;
              break;

            case 15:
              if (!(priceOracle == Fuse.PUBLIC_PREFERRED_PRICE_ORACLE_CONTRACT_ADDRESS)) {
                _context24.next = 19;
                break;
              }

              priceOracleContractName = "\u26A0\uFE0F PreferredPriceOracle - Public";
              _context24.next = 23;
              break;

            case 19:
              _context24.next = 21;
              return App.fuse.getPriceOracle(priceOracle);

            case 21:
              potentialName = _context24.sent;

              if (potentialName !== null) {
                priceOracleContractName = potentialName;
                if (priceOracleContractName === "PreferredPriceOracle") priceOracleContractName = "\u26A0\uFE0F\u26A0\uFE0F PreferredPriceOracle - Private";else if (priceOracleContractName === "UniswapView") priceOracleContractName = "\u26A0\uFE0F\u26A0\uFE0F UniswapAnchoredView - Private";else if (priceOracleContractName === "UniswapAnchoredView") priceOracleContractName = "\u26A0\uFE0F\u26A0\uFE0F UniswapAnchoredView - Private";
              }

            case 23:
              // Set pool details/stats
              $('.pool-detailed-creator').text($(this).data("creator"));
              _context24.t0 = $('.pool-detailed-close-factor');
              _context24.t1 = Big;
              _context24.next = 28;
              return comptrollerInstance.methods.closeFactorMantissa().call();

            case 28:
              _context24.t2 = _context24.sent;
              _context24.t3 = new _context24.t1(_context24.t2).div(1e18).toFormat(4);

              _context24.t0.text.call(_context24.t0, _context24.t3);

              _context24.t4 = $('.pool-detailed-max-assets');
              _context24.t5 = Big;
              _context24.next = 35;
              return comptrollerInstance.methods.maxAssets().call();

            case 35:
              _context24.t6 = _context24.sent;
              _context24.t7 = new _context24.t5(_context24.t6).div(1e18).toFormat(4);

              _context24.t4.text.call(_context24.t4, _context24.t7);

              _context24.t8 = $('.pool-detailed-liquidation-incentive');
              _context24.t9 = Big;
              _context24.next = 42;
              return comptrollerInstance.methods.liquidationIncentiveMantissa().call();

            case 42:
              _context24.t10 = _context24.sent;
              _context24.t11 = new _context24.t9(_context24.t10).div(1e18).toFormat(4);

              _context24.t8.text.call(_context24.t8, _context24.t11);

              $('.pool-detailed-oracle').text(priceOracleContractName); // Get oracle name from bytecode

              $('.pool-detailed-privacy').text(parseInt($(this).data("privacy")) > 0 ? "Private" : "Public"); // Add assets to tables

              _context24.next = 49;
              return App.fuse.contracts.FusePoolDirectory.methods.getPoolAssetsWithData(comptroller).call({
                from: App.selectedAccount
              });

            case 49:
              cTokens = _context24.sent;
              html = '';

              for (i = 0; i < cTokens.length; i++) {
                underlyingDecimals = parseInt(cTokens[i].underlyingDecimals);
                html += '<tr data-ctoken="' + cTokens[i].cToken + '" data-underlying="' + cTokens[i].underlyingToken + '" data-symbol="' + cTokens[i].underlyingSymbol + '" data-decimals="' + cTokens[i].underlyingDecimals + '"><td scope="row">' + cTokens[i].underlyingName + '</td><td>' + cTokens[i].underlyingSymbol + '</td><td><a href="#" class="apy">' + new Big(cTokens[i].supplyRatePerBlock).mul(2372500).div(1e16).toFormat(2) + '</a></td><td>' + new Big(cTokens[i].totalSupply).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].supplyBalance).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].underlyingBalance).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input collateral-switch" data-comptroller="' + comptroller + '" id="collateral-switch-' + (i + 1) + '"' + (cTokens[i].membership ? " checked" : "") + '><label class="custom-control-label" for="collateral-switch-' + (i + 1) + '">Collateral</label></div></td><td><button type="button" class="btn btn-success btn-sm button-deposit">Deposit</button><button type="button" class="btn btn-danger btn-sm button-withdraw">Withdraw</button></td></tr>';
              }

              $('.pool-detailed-table-assets-supply tbody').html(html);
              html = '';

              for (i = 0; i < cTokens.length; i++) {
                underlyingDecimals = parseInt(cTokens[i].underlyingDecimals);
                html += '<tr data-ctoken="' + cTokens[i].cToken + '" data-underlying="' + cTokens[i].underlyingToken + '" data-symbol="' + cTokens[i].underlyingSymbol + '" data-decimals="' + cTokens[i].underlyingDecimals + '"><td scope="row">' + cTokens[i].underlyingName + '</td><td>' + cTokens[i].underlyingSymbol + '</td><td><a href="#" class="apy">' + new Big(cTokens[i].borrowRatePerBlock).mul(2372500).div(1e16).toFormat(2) + '</a></td><td>' + new Big(cTokens[i].totalBorrow).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].borrowBalance).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].underlyingBalance).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].liquidity).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td><button type="button" class="btn btn-warning btn-sm button-borrow">Borrow</button><button type="button" class="btn btn-primary btn-sm button-repay">Repay</button></td></tr>';
              }

              $('.pool-detailed-table-assets-borrow tbody').html(html); // APY click handler

              $('.pool-detailed-table-assets-supply .apy, .pool-detailed-table-assets-borrow .apy').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                var interestRateModel, borrowerRates, supplierRates, i;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return App.fuse.getInterestRateModel($(this).closest('tr').data("ctoken"));

                      case 2:
                        interestRateModel = _context12.sent;

                        if (!(interestRateModel === null)) {
                          _context12.next = 5;
                          break;
                        }

                        return _context12.abrupt("return", toastr["error"]("Interest rate model not recognized.", "APY predictions failed"));

                      case 5:
                        borrowerRates = [];
                        supplierRates = [];

                        for (i = 0; i <= 100; i++) {
                          borrowerRates.push({
                            x: i,
                            y: Number(new Big(interestRateModel.getBorrowRate(Web3.utils.toBN(i * 1e16)).toString()).mul(2372500).div(1e16))
                          });
                          supplierRates.push({
                            x: i,
                            y: Number(new Big(interestRateModel.getSupplyRate(Web3.utils.toBN(i * 1e16)).toString()).mul(2372500).div(1e16))
                          });
                        }

                        App.initInterestRateModelChart(borrowerRates, supplierRates);
                        $('#modal-interest-rate-model').modal('show');

                      case 10:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12, this);
              }))); // Unhealthy accounts table

              _context24.next = 59;
              return App.fuse.contracts.FusePoolDirectory.methods.getPoolUsersWithData(comptroller, Web3.utils.toBN(1e18)).call();

            case 59:
              data = _context24.sent;
              borrowers = data["0"];
              borrowers.sort(function (a, b) {
                return parseInt(b.totalBorrow) - parseInt(a.totalBorrow);
              });
              closeFactor = new Big(data["1"]).div(1e18);
              liquidationIncentive = new Big(data["2"]).div(1e18);
              html = '';
              _iterator = _createForOfIteratorHelper(borrowers);
              _context24.prev = 66;

              _iterator.s();

            case 68:
              if ((_step = _iterator.n()).done) {
                _context24.next = 121;
                break;
              }

              borrower = _step.value;
              // Get debt and collateral
              borrower = _objectSpread({}, borrower);
              borrower.debt = [];
              borrower.collateral = [];
              _iterator2 = _createForOfIteratorHelper(borrower.assets);

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  asset = _step2.value;
                  asset = _objectSpread({}, asset);
                  asset.borrowBalanceEth = new Big(asset.borrowBalance).mul(asset.underlyingPrice).div(1e36);
                  asset.supplyBalanceEth = new Big(asset.supplyBalance).mul(asset.underlyingPrice).div(1e36);
                  if (parseInt(asset.borrowBalance) > 0) borrower.debt.push(asset);
                  if (asset.membership && parseInt(asset.supplyBalance) > 0) borrower.collateral.push(asset);
                } // Sort debt and collateral from highest to lowest ETH value

              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              borrower.debt.sort(function (a, b) {
                return b.borrowBalanceEth.gt(a.borrowBalanceEth);
              });
              borrower.collateral.sort(function (a, b) {
                return b.supplyBalanceEth.gt(a.supplyBalanceEth);
              }); // Get max liquidation value across all borrows

              borrower.maxLiquidationValue = new Big(borrower.totalBorrow).mul(closeFactor).div(1e18); // Get debt and collateral prices

              underlyingDebtPrice = new Big(borrower.debt[0].underlyingPrice).div(new Big(10).pow(36 - borrower.debt[0].underlyingDecimals));
              underlyingCollateralPrice = new Big(borrower.collateral[0].underlyingPrice).div(new Big(10).pow(36 - borrower.collateral[0].underlyingDecimals)); // Get liquidation amount

              debtAmount = new Big(borrower.debt[0].borrowBalance).div(new Big(10).pow(parseInt(borrower.debt[0].underlyingDecimals)));
              liquidationAmount = debtAmount.mul(closeFactor);
              liquidationValueEth = liquidationAmount.mul(underlyingDebtPrice); // Get seize amount

              seizeAmountEth = liquidationValueEth.mul(liquidationIncentive);
              seizeAmount = seizeAmountEth.div(underlyingCollateralPrice); // Check if actual collateral is too low to seize seizeAmount; if so, recalculate liquidation amount

              actualCollateral = new Big(borrower.collateral[0].supplyBalance).div(new Big(10).pow(parseInt(borrower.collateral[0].underlyingDecimals)));

              if (seizeAmount.gt(actualCollateral)) {
                seizeAmount = actualCollateral;
                seizeAmountEth = seizeAmount.mul(underlyingCollateralPrice);
                liquidationValueEth = seizeAmountEth.div(liquidationIncentive);
                liquidationAmount = liquidationValueEth.div(underlyingDebtPrice);
              } // Add info to predictions array


              borrower.predictions = [];
              borrower.predictions.push("Liquidate " + liquidationAmount.toFormat(8) + " " + borrower.debt[0].underlyingSymbol + " (" + liquidationValueEth.toFormat(8) + " ETH) debt");
              borrower.predictions.push("Collect " + seizeAmount.toFormat(8) + borrower.collateral[0].underlyingSymbol + " (" + seizeAmountEth.toFormat(8) + " ETH) collateral"); // Calculate expected gas fee

              expectedGasAmount = 0;
              _context24.prev = 91;

              if (!(borrower.debt[0].underlyingSymbol === 'ETH')) {
                _context24.next = 98;
                break;
              }

              _context24.next = 95;
              return App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, borrower.debt[0].cToken, borrower.collateral[0].cToken, 0, borrower.collateral[0].cToken).estimateGas({
                gas: 1e9,
                value: liquidationAmount.mul(new Big(10).pow(parseInt(borrower.debt[0].underlyingDecimals))).toFixed(0),
                from: App.selectedAccount
              });

            case 95:
              expectedGasAmount = _context24.sent;
              _context24.next = 101;
              break;

            case 98:
              _context24.next = 100;
              return App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, liquidationAmount.mul(new Big(10).pow(parseInt(borrower.debt[0].underlyingDecimals))).toFixed(0), borrower.debt[0].cToken, borrower.collateral[0].cToken, 0, borrower.collateral[0].cToken).estimateGas({
                gas: 1e9,
                from: App.selectedAccount
              });

            case 100:
              expectedGasAmount = _context24.sent;

            case 101:
              _context24.next = 106;
              break;

            case 103:
              _context24.prev = 103;
              _context24.t12 = _context24["catch"](91);
              expectedGasAmount = 600000;

            case 106:
              _context24.t13 = Big;
              _context24.next = 109;
              return App.web3.eth.getGasPrice();

            case 109:
              _context24.t14 = _context24.sent;
              gasPrice = new _context24.t13(_context24.t14).div(1e18);
              expectedGasFee = gasPrice.mul(expectedGasAmount);
              borrower.predictions.push("Gas Amount = " + expectedGasAmount + ", Gas Fee = " + expectedGasFee.toFormat(8) + " ETH"); // Calculate expected profit after gas fees

              expectedRevenue = seizeAmount.mul(underlyingCollateralPrice).sub(liquidationAmount.mul(underlyingDebtPrice));
              borrower.predictions.push("Expected Revenue = " + expectedRevenue.toFormat(8) + "ETH");
              expectedProfit = expectedRevenue.sub(expectedGasFee);
              borrower.predictions.push("Expected Profit = " + expectedProfit.toFormat(8) + "ETH"); // Calculate minSeizeAmount: we want expectedProfit = 0, so expectedRevenue = expectedGasFee

              minSeizeAmount = expectedGasFee.add(liquidationAmount.mul(underlyingDebtPrice)).div(underlyingCollateralPrice); // Add row to table

              html += "<tr data-borrower=\"" + borrower.account + "\" data-debt-ctoken=\"" + borrower.debt[0].cToken + "\" data-debt-underlying=\"" + borrower.debt[0].underlyingToken + "\" data-debt-symbol=\"" + borrower.debt[0].underlyingSymbol + "\" data-debt-decimals=\"" + borrower.debt[0].underlyingDecimals + "\" data-liquidation-amount=\"" + liquidationAmount.toFixed(parseInt(borrower.debt[0].underlyingDecimals)) + "\" data-collateral-ctoken=\"" + borrower.collateral[0].cToken + "\" data-collateral-underlying=\"" + borrower.collateral[0].underlyingToken + "\"data-collateral-symbol=\"" + borrower.collateral[0].underlyingSymbol + "\" data-collateral-decimals=\"" + borrower.collateral[0].underlyingDecimals + "\" data-min-seize=\"" + minSeizeAmount.toFixed(parseInt(borrower.collateral[0].underlyingDecimals)) + "\">\n          <td scope=\"row\">" + borrower.account + "</td>\n          <td>" + new Big(borrower.health).div(1e18).toFormat(8) + "</td>\n          <td>" + new Big(borrower.totalBorrow).div(1e18).toFormat(8) + " ETH</td>\n          <td>" + borrower.maxLiquidationValue.toFormat(8) + " ETH</td>\n          <td>\n            <ul class=\"m-0 p-0\" style=\"list-style-type: none;\">" + borrower.debt.map(function (asset) {
                return '<li key="' + asset.underlyingToken + '">' + asset.underlyingSymbol + ': ' + new Big(asset.borrowBalance).div(new Big(10).pow(parseInt(asset.underlyingDecimals))).toFormat(8) + '</li>';
              }) + "</ul>\n          </td>\n          <td>\n            <ul class=\"m-0 p-0\" style=\"list-style-type: none;\">" + borrower.debt.map(function (asset) {
                return '<li key="' + asset.underlyingToken + '">' + asset.underlyingSymbol + ': ' + asset.borrowBalanceEth.toFormat(8) + ' ETH</li>';
              }) + "</ul>\n          </td>\n          <td>" + new Big(borrower.totalCollateral).div(1e18).toFormat(8) + " ETH</td>\n          <td>\n            <ul class=\"m-0 p-0\" style=\"list-style-type: none;\">" + borrower.collateral.map(function (asset) {
                return '<li key="' + asset.underlyingToken + '">' + asset.underlyingSymbol + ': ' + new Big(asset.supplyBalance).div(new Big(10).pow(parseInt(asset.underlyingDecimals))).toFormat(8) + '</li>';
              }) + "</ul>\n          </td>\n          <td>\n            <ul class=\"m-0 p-0\" style=\"list-style-type: none;\">" + borrower.collateral.map(function (asset) {
                return '<li key="' + asset.underlyingToken + '">' + asset.underlyingSymbol + ': ' + asset.supplyBalanceEth.toFormat(8) + ' ETH</li>';
              }) + "</ul>\n          </td>\n          <td>\n            <ul class=\"m-0 p-0\" style=\"list-style-type: none;\">" + borrower.predictions.map(function (tx, i) {
                return '<li key="' + i + '">' + tx + '</li>';
              }) + "</ul>\n          </td>\n          <td><button type=\"button\" class=\"btn btn-info btn-sm button-liquidate\">Liquidate</button></td>\n        </tr>";

            case 119:
              _context24.next = 68;
              break;

            case 121:
              _context24.next = 126;
              break;

            case 123:
              _context24.prev = 123;
              _context24.t15 = _context24["catch"](66);

              _iterator.e(_context24.t15);

            case 126:
              _context24.prev = 126;

              _iterator.f();

              return _context24.finish(126);

            case 129:
              $('.pool-detailed-table-liquidations tbody').html(html); // Switch pages

              $('#page-pools').hide();
              $('#page-pool').show(); // Collateral switch handler

              $('.pool-detailed-table-assets-supply .collateral-switch').change( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                var comptroller;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        comptroller = new App.web3.eth.Contract(App.comptrollerAbi, $(this).data("comptroller"));

                        if (!$(this).is(':checked')) {
                          _context13.next = 13;
                          break;
                        }

                        _context13.prev = 2;
                        _context13.next = 5;
                        return comptroller.methods.enterMarkets([$(this).closest('tr').data("ctoken")]).send({
                          from: App.selectedAccount
                        });

                      case 5:
                        _context13.next = 11;
                        break;

                      case 7:
                        _context13.prev = 7;
                        _context13.t0 = _context13["catch"](2);
                        $(this).prop("checked", false);
                        return _context13.abrupt("return", toastr["error"]("Entering market failed: " + (_context13.t0.message ? _context13.t0.message : _context13.t0), "Entering market failed"));

                      case 11:
                        _context13.next = 22;
                        break;

                      case 13:
                        _context13.prev = 13;
                        _context13.next = 16;
                        return comptroller.methods.exitMarket($(this).closest('tr').data("ctoken")).send({
                          from: App.selectedAccount
                        });

                      case 16:
                        _context13.next = 22;
                        break;

                      case 18:
                        _context13.prev = 18;
                        _context13.t1 = _context13["catch"](13);
                        $(this).prop("checked", true);
                        return _context13.abrupt("return", toastr["error"]("Exiting market failed: " + (_context13.t1.message ? _context13.t1.message : _context13.t1), "Exiting market failed"));

                      case 22:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13, this, [[2, 7], [13, 18]]);
              }))); // Supply tab button handlers

              $('.pool-detailed-table-assets-supply .button-deposit').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
                var token, underlyingSymbol, balance, underlyingDecimals, cToken;
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        token = new App.web3.eth.Contract(App.erc20Abi, $(this).closest('tr').data("underlying"));
                        underlyingSymbol = $(this).closest('tr').data("symbol");
                        _context15.next = 4;
                        return underlyingSymbol === "ETH" ? App.web3.eth.getBalance(App.selectedAccount) : token.methods.balanceOf(App.selectedAccount).call();

                      case 4:
                        balance = _context15.sent;
                        underlyingDecimals = $(this).closest('tr').data("decimals");
                        $('#modal-deposit #DepositAmount').val(new Big(balance).div(new Big(10).pow(underlyingDecimals)).toFixed());
                        $('#modal-deposit #DepositCurrencyName').val($(this).closest('tr').data("name"));
                        $('#modal-deposit #DepositCurrencySymbol option').text(underlyingSymbol);
                        $('#modal-deposit').modal('show');
                        cToken = new App.web3.eth.Contract(underlyingSymbol === "ETH" ? App.cEtherAbi : App.cErc20Abi, $(this).closest('tr').data("ctoken"));
                        $('#modal-deposit #depositButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                          var amount;
                          return regeneratorRuntime.wrap(function _callee14$(_context14) {
                            while (1) {
                              switch (_context14.prev = _context14.next) {
                                case 0:
                                  amount = $('#DepositAmount').val();

                                  if (amount) {
                                    _context14.next = 3;
                                    break;
                                  }

                                  return _context14.abrupt("return", toastr["error"]("Invalid deposit amount.", "Deposit failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDecimals)).toFixed(0));

                                  if (!(underlyingSymbol !== "ETH")) {
                                    _context14.next = 13;
                                    break;
                                  }

                                  _context14.prev = 5;
                                  _context14.next = 8;
                                  return token.methods.approve(cToken.options.address, amount).send({
                                    from: App.selectedAccount
                                  });

                                case 8:
                                  _context14.next = 13;
                                  break;

                                case 10:
                                  _context14.prev = 10;
                                  _context14.t0 = _context14["catch"](5);
                                  return _context14.abrupt("return", toastr["error"]("Approval failed: " + (_context14.t0.message ? _context14.t0.message : _context14.t0), "Deposit failed"));

                                case 13:
                                  _context14.prev = 13;
                                  _context14.next = 16;
                                  return underlyingSymbol === "ETH" ? cToken.methods.mint().send({
                                    from: App.selectedAccount,
                                    value: amount
                                  }) : cToken.methods.mint(amount).send({
                                    from: App.selectedAccount
                                  });

                                case 16:
                                  _context14.next = 21;
                                  break;

                                case 18:
                                  _context14.prev = 18;
                                  _context14.t1 = _context14["catch"](13);
                                  return _context14.abrupt("return", toastr["error"]("Deposit failed: " + (_context14.t1.message ? _context14.t1.message : _context14.t1), "Deposit failed"));

                                case 21:
                                  $('#modal-deposit').modal('hide');

                                case 22:
                                case "end":
                                  return _context14.stop();
                              }
                            }
                          }, _callee14, null, [[5, 10], [13, 18]]);
                        })));

                      case 12:
                      case "end":
                        return _context15.stop();
                    }
                  }
                }, _callee15, this);
              })));
              $('.pool-detailed-table-assets-supply .button-withdraw').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                var cToken, balance, underlyingDecimals;
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        cToken = new App.web3.eth.Contract(App.cErc20Abi, $(this).closest('tr').data("ctoken"));
                        _context17.next = 3;
                        return cToken.methods.balanceOfUnderlying(App.selectedAccount).call();

                      case 3:
                        balance = _context17.sent;
                        underlyingDecimals = $(this).closest('tr').data("decimals");
                        $('#modal-withdraw #WithdrawAmount').val(new Big(balance).div(new Big(10).pow(underlyingDecimals)).toFixed());
                        $('#modal-withdraw #WithdrawCurrencyName').val($(this).closest('tr').data("name"));
                        $('#modal-withdraw #WithdrawCurrencySymbol option').text($(this).closest('tr').data("symbol"));
                        $('#modal-withdraw').modal('show');
                        $('#modal-withdraw #withdrawButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
                          var amount;
                          return regeneratorRuntime.wrap(function _callee16$(_context16) {
                            while (1) {
                              switch (_context16.prev = _context16.next) {
                                case 0:
                                  amount = $('#WithdrawAmount').val();

                                  if (amount) {
                                    _context16.next = 3;
                                    break;
                                  }

                                  return _context16.abrupt("return", toastr["error"]("Invalid withdrawal amount.", "Withdrawal failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDecimals)).toFixed(0));
                                  _context16.prev = 4;
                                  _context16.next = 7;
                                  return cToken.methods.redeemUnderlying(amount).send({
                                    from: App.selectedAccount
                                  });

                                case 7:
                                  _context16.next = 12;
                                  break;

                                case 9:
                                  _context16.prev = 9;
                                  _context16.t0 = _context16["catch"](4);
                                  return _context16.abrupt("return", toastr["error"]("Withdrawal failed: " + (_context16.t0.message ? _context16.t0.message : _context16.t0), "Withdrawal failed"));

                                case 12:
                                  $('#modal-withdraw').modal('hide');

                                case 13:
                                case "end":
                                  return _context16.stop();
                              }
                            }
                          }, _callee16, null, [[4, 9]]);
                        })));

                      case 10:
                      case "end":
                        return _context17.stop();
                    }
                  }
                }, _callee17, this);
              }))); // Borrow tab button handlers

              $('.pool-detailed-table-assets-borrow .button-borrow').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
                var underlyingDecimals, cToken;
                return regeneratorRuntime.wrap(function _callee19$(_context19) {
                  while (1) {
                    switch (_context19.prev = _context19.next) {
                      case 0:
                        // TODO: Get max borrow?
                        $('#modal-borrow #BorrowCurrencyName').val($(this).closest('tr').data("name"));
                        $('#modal-borrow #BorrowCurrencySymbol option').text($(this).closest('tr').data("symbol"));
                        $('#modal-borrow').modal('show');
                        underlyingDecimals = $(this).closest('tr').data("decimals");
                        cToken = new App.web3.eth.Contract(App.cErc20Abi, $(this).closest('tr').data("ctoken"));
                        $('#modal-borrow #borrowButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
                          var amount;
                          return regeneratorRuntime.wrap(function _callee18$(_context18) {
                            while (1) {
                              switch (_context18.prev = _context18.next) {
                                case 0:
                                  amount = $('#BorrowAmount').val();

                                  if (amount) {
                                    _context18.next = 3;
                                    break;
                                  }

                                  return _context18.abrupt("return", toastr["error"]("Invalid borrow amount.", "Borrow failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDecimals)).toFixed(0));
                                  _context18.prev = 4;
                                  _context18.next = 7;
                                  return cToken.methods.borrow(amount).send({
                                    from: App.selectedAccount
                                  });

                                case 7:
                                  _context18.next = 12;
                                  break;

                                case 9:
                                  _context18.prev = 9;
                                  _context18.t0 = _context18["catch"](4);
                                  return _context18.abrupt("return", toastr["error"]("Borrow failed: " + (_context18.t0.message ? _context18.t0.message : _context18.t0), "Borrow failed"));

                                case 12:
                                  $('#modal-borrow').modal('hide');

                                case 13:
                                case "end":
                                  return _context18.stop();
                              }
                            }
                          }, _callee18, null, [[4, 9]]);
                        })));

                      case 6:
                      case "end":
                        return _context19.stop();
                    }
                  }
                }, _callee19, this);
              })));
              $('.pool-detailed-table-assets-borrow .button-repay').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
                var underlyingSymbol, cToken, balance, underlyingDecimals, token;
                return regeneratorRuntime.wrap(function _callee21$(_context21) {
                  while (1) {
                    switch (_context21.prev = _context21.next) {
                      case 0:
                        underlyingSymbol = $(this).closest('tr').data("symbol");
                        cToken = new App.web3.eth.Contract(underlyingSymbol === "ETH" ? App.cEtherAbi : App.cErc20Abi, $(this).closest('tr').data("ctoken"));
                        _context21.next = 4;
                        return cToken.methods.borrowBalanceCurrent(App.selectedAccount).call();

                      case 4:
                        balance = _context21.sent;
                        underlyingDecimals = $(this).closest('tr').data("decimals");
                        $('#modal-repay #RepayAmount').val(new Big(balance).div(new Big(10).pow(underlyingDecimals)).toFixed());
                        $('#modal-repay #RepayCurrencyName').val($(this).closest('tr').data("name"));
                        $('#modal-repay #RepayCurrencySymbol option').text($(this).closest('tr').data("symbol"));
                        $('#modal-repay').modal('show');
                        token = new App.web3.eth.Contract(App.erc20Abi, $(this).closest('tr').data("underlying"));
                        $('#modal-repay #repayButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
                          var amount;
                          return regeneratorRuntime.wrap(function _callee20$(_context20) {
                            while (1) {
                              switch (_context20.prev = _context20.next) {
                                case 0:
                                  amount = $('#RepayAmount').val();

                                  if (amount) {
                                    _context20.next = 3;
                                    break;
                                  }

                                  return _context20.abrupt("return", toastr["error"]("Invalid repayment amount.", "Repayment failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDecimals)).toFixed(0));

                                  if (!(underlyingSymbol !== "ETH")) {
                                    _context20.next = 13;
                                    break;
                                  }

                                  _context20.prev = 5;
                                  _context20.next = 8;
                                  return token.methods.approve(cToken.options.address, amount).send({
                                    from: App.selectedAccount
                                  });

                                case 8:
                                  _context20.next = 13;
                                  break;

                                case 10:
                                  _context20.prev = 10;
                                  _context20.t0 = _context20["catch"](5);
                                  return _context20.abrupt("return", toastr["error"]("Approval failed: " + (_context20.t0.message ? _context20.t0.message : _context20.t0), "Repayment failed"));

                                case 13:
                                  _context20.prev = 13;
                                  _context20.next = 16;
                                  return underlyingSymbol === "ETH" ? cToken.methods.repayBorrow().send({
                                    from: App.selectedAccount,
                                    value: amount
                                  }) : cToken.methods.repayBorrow(amount).send({
                                    from: App.selectedAccount
                                  });

                                case 16:
                                  _context20.next = 21;
                                  break;

                                case 18:
                                  _context20.prev = 18;
                                  _context20.t1 = _context20["catch"](13);
                                  return _context20.abrupt("return", toastr["error"]("Repayment failed: " + (_context20.t1.message ? _context20.t1.message : _context20.t1), "Repayment failed"));

                                case 21:
                                  $('#modal-repay').modal('hide');

                                case 22:
                                case "end":
                                  return _context20.stop();
                              }
                            }
                          }, _callee20, null, [[5, 10], [13, 18]]);
                        })));

                      case 12:
                      case "end":
                        return _context21.stop();
                    }
                  }
                }, _callee21, this);
              }))); // Liquidation button handler

              $('.pool-detailed-table-liquidations .button-liquidate').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
                var debtCToken, underlyingDebtToken, underlyingDebtSymbol, underlyingDebtDecimals, liquidationAmount, collateralCToken, underlyingCollateralToken, underlyingCollateralSymbol, underlyingCollateralDecimals, minSeize, debtToken;
                return regeneratorRuntime.wrap(function _callee23$(_context23) {
                  while (1) {
                    switch (_context23.prev = _context23.next) {
                      case 0:
                        debtCToken = $(this).closest('tr').data("debt-ctoken");
                        underlyingDebtToken = $(this).closest('tr').data("debt-underlying");
                        underlyingDebtSymbol = $(this).closest('tr').data("debt-symbol");
                        underlyingDebtDecimals = $(this).closest('tr').data("debt-decimals");
                        liquidationAmount = $(this).closest('tr').data("liquidation-amount");
                        collateralCToken = $(this).closest('tr').data("collateral-ctoken");
                        underlyingCollateralToken = $(this).closest('tr').data("collateral-underlying");
                        underlyingCollateralSymbol = $(this).closest('tr').data("collateral-symbol");
                        underlyingCollateralDecimals = $(this).closest('tr').data("collateral-decimals");
                        minSeize = $(this).closest('tr').data("min-seize");
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
                        debtToken = new App.web3.eth.Contract(App.erc20Abi, underlyingDebtToken);
                        $('#modal-liquidate #LiquidateMethod').off('change').change(function () {
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
                        $('#modal-liquidate #LiquidateSeizeCurrencySymbol, #modal-liquidate #LiquidateProfitCurrencySymbol').off('change').change(function () {
                          $('#modal-liquidate #LiquidateSeizeCurrencySymbol, #modal-liquidate #LiquidateProfitCurrencySymbol').val($(this).val());
                          $(this).val() === "other" ? $('#LiquidateExchangeProfitToWrapper').show() : $('#LiquidateExchangeProfitToWrapper').hide();
                        });
                        $('#modal-liquidate #liquidateButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
                          var amount, liquidateMethod, exchangeProfitTo, exchangeProfitToDecimals, minProfit, minSeize;
                          return regeneratorRuntime.wrap(function _callee22$(_context22) {
                            while (1) {
                              switch (_context22.prev = _context22.next) {
                                case 0:
                                  // Validate amount and get liquidation method
                                  amount = $('#LiquidateAmount').val();

                                  if (amount) {
                                    _context22.next = 3;
                                    break;
                                  }

                                  return _context22.abrupt("return", toastr["error"]("Invalid liquidation amount.", "Liquidation failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDebtDecimals)).toFixed(0));
                                  liquidateMethod = $('#LiquidateMethod').val(); // Validate exchangeProfitTo

                                  exchangeProfitTo = liquidateMethod === "uniswap" ? $('#modal-liquidate #LiquidateProfitCurrencySymbol').val() : $('#modal-liquidate #LiquidateSeizeCurrencySymbol').val();
                                  if (exchangeProfitTo == "collateral") exchangeProfitTo = underlyingCollateralToken;else if (exchangeProfitTo == "debt") exchangeProfitTo = underlyingDebtToken;else if (exchangeProfitTo == "eth") exchangeProfitTo = "0x0000000000000000000000000000000000000000";else exchangeProfitTo = $('#LiquidateExchangeProfitTo').val();

                                  if (exchangeProfitTo) {
                                    _context22.next = 9;
                                    break;
                                  }

                                  return _context22.abrupt("return", toastr["error"]("No destination currency specified for seized collateral.", "Liquidation failed"));

                                case 9:
                                  // Get exchangeProfitTo decimal precision
                                  exchangeProfitToDecimals = 18;

                                  if (!(exchangeProfitTo !== "0x0000000000000000000000000000000000000000")) {
                                    _context22.next = 22;
                                    break;
                                  }

                                  _context22.prev = 11;
                                  _context22.t0 = parseInt;
                                  _context22.next = 15;
                                  return new App.web3.eth.Contract(App.erc20Abi, exchangeProfitTo).methods.decimals().call();

                                case 15:
                                  _context22.t1 = _context22.sent;
                                  exchangeProfitToDecimals = (0, _context22.t0)(_context22.t1);
                                  _context22.next = 22;
                                  break;

                                case 19:
                                  _context22.prev = 19;
                                  _context22.t2 = _context22["catch"](11);
                                  return _context22.abrupt("return", toastr["error"]("Failed to retrieve decimal precision of exchange output token.", "Liquidation failed"));

                                case 22:
                                  if (!(liquidateMethod === "uniswap")) {
                                    _context22.next = 35;
                                    break;
                                  }

                                  // Liquidate via flashloan
                                  minProfit = $('#LiquidateMinProfit').val();
                                  if (!minProfit) minProfit = Web3.utils.toBN(0);else minProfit = Web3.utils.toBN(new Big(minProfit).mul(new Big(10).pow(exchangeProfitToDecimals)).toFixed(0));
                                  _context22.prev = 25;
                                  _context22.next = 28;
                                  return underlyingDebtSymbol === "ETH" ? App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidateToEthWithFlashLoan(borrower.account, amount, debtCToken, collateralCToken, minProfit, exchangeProfitTo).send({
                                    from: App.selectedAccount
                                  }) : App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidateToTokensWithFlashLoan(borrower.account, amount, debtCToken, collateralCToken, minProfit, exchangeProfitTo).send({
                                    from: App.selectedAccount
                                  });

                                case 28:
                                  _context22.next = 33;
                                  break;

                                case 30:
                                  _context22.prev = 30;
                                  _context22.t3 = _context22["catch"](25);
                                  return _context22.abrupt("return", toastr["error"]("Liquidation failed: " + (_context22.t3.message ? _context22.t3.message : _context22.t3), "Liquidation failed"));

                                case 33:
                                  _context22.next = 54;
                                  break;

                                case 35:
                                  // Liquidate using local capital
                                  minSeize = $('#LiquidateMinSeize').val();
                                  if (!minSeize) minSeize = Web3.utils.toBN(0);else minSeize = Web3.utils.toBN(new Big(minSeize).mul(new Big(10).pow(exchangeProfitToDecimals)).toFixed(0));

                                  if (!(underlyingDebtSymbol !== "ETH")) {
                                    _context22.next = 46;
                                    break;
                                  }

                                  _context22.prev = 38;
                                  _context22.next = 41;
                                  return debtToken.methods.approve(App.fuse.contracts.FuseSafeLiquidator.options.address, amount).send({
                                    from: App.selectedAccount
                                  });

                                case 41:
                                  _context22.next = 46;
                                  break;

                                case 43:
                                  _context22.prev = 43;
                                  _context22.t4 = _context22["catch"](38);
                                  return _context22.abrupt("return", toastr["error"]("Approval failed: " + (_context22.t4.message ? _context22.t4.message : _context22.t4), "Liquidation failed"));

                                case 46:
                                  _context22.prev = 46;
                                  _context22.next = 49;
                                  return underlyingDebtSymbol === "ETH" ? App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, debtCToken, collateralCToken, minSeize, exchangeProfitTo).send({
                                    from: App.selectedAccount,
                                    value: amount
                                  }) : App.fuse.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, amount, debtCToken, collateralCToken, minSeize, exchangeProfitTo).send({
                                    from: App.selectedAccount
                                  });

                                case 49:
                                  _context22.next = 54;
                                  break;

                                case 51:
                                  _context22.prev = 51;
                                  _context22.t5 = _context22["catch"](46);
                                  return _context22.abrupt("return", toastr["error"]("Liquidation failed: " + (_context22.t5.message ? _context22.t5.message : _context22.t5), "Liquidation failed"));

                                case 54:
                                  // Hide modal
                                  $('#modal-repay').modal('hide');

                                case 55:
                                case "end":
                                  return _context22.stop();
                              }
                            }
                          }, _callee22, null, [[11, 19], [25, 30], [38, 43], [46, 51]]);
                        })));

                      case 28:
                      case "end":
                        return _context23.stop();
                    }
                  }
                }, _callee23, this);
              })));

            case 138:
            case "end":
              return _context24.stop();
          }
        }
      }, _callee24, this, [[66, 123, 126, 129], [91, 103]]);
    })));
  }
};
$(function () {
  $(document).ready(function () {
    App.init();
  });
});
