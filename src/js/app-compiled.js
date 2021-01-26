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
  contracts: {},
  comptrollerAbi: null,
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
      var chainId, _i, _Object$keys, symbol, i;

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
              } // Refresh contracts to use new Web3


              for (_i = 0, _Object$keys = Object.keys(App.contracts); _i < _Object$keys.length; _i++) {
                symbol = _Object$keys[_i];
                App.contracts[symbol] = new App.web3.eth.Contract(App.contracts[symbol].options.jsonInterface, App.contracts[symbol].options.address);
              } // Get user's account balance in the stablecoin fund, RFT balance, and account balance limit
              // TODO: Below


              if (App.contracts.FusePoolDirectory) {
                App.getMyFusePools();
                if (!App.intervalGetMyFusePools) App.intervalGetMyFusePools = setInterval(App.getMyFusePools, 5 * 60 * 1000);
              } // Load acounts dropdown


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
              $(".pools-table-private tbody").html('');
              $("#DeployAssetPool option:not(:disabled)").remove(''); // Disable button while UI is loading.
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
              $('#page-pools').hide();
              $('#page-deploy').show();
              $('#tab-pools').css('text-decoration', '');
              $('#tab-deploy').css('text-decoration', 'underline');

            case 15:
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
              $(".btn-connect").show(); // TODO: Below

              /* $('#FusePools').text("Loading...");
              $('#MyFusePools').text("Loading..."); */

            case 10:
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
  initContracts: function initContracts() {
    $.getJSON('abi/FusePoolDirectory.json?v=1611171333', function (data) {
      App.contracts.FusePoolDirectory = new App.web3.eth.Contract(data, "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");
      App.getFusePools();
      setInterval(App.getFusePools, 5 * 60 * 1000);

      if (App.selectedAccount) {
        App.getMyFusePools();
        if (!App.intervalGetMyFusePools) App.intervalGetMyFusePools = setInterval(App.getMyFusePools, 5 * 60 * 1000);
      }
    });
    $.getJSON('abi/FuseSafeLiquidator.json?v=1611171333', function (data) {
      App.contracts.FuseSafeLiquidator = new App.web3.eth.Contract(data, "0x0165878A594ca255338adfa4d48449f69242Eb8F");
    });
    $.getJSON('abi/Comptroller.json?v=1600737538', function (data) {
      App.comptrollerAbi = data;
    });
    $.getJSON('abi/CErc20.json?v=1600737538', function (data) {
      App.cErc20Abi = data;
    });
    $.getJSON('abi/ERC20.json?v=1600737538', function (data) {
      App.erc20Abi = data;
    });
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
      // TODO: Below

      /* if (App.contracts.FusePoolDirectory) {
        App.getMyFusePools();
        if (!App.intervalGetMyFusePools) App.intervalGetMyFusePools = setInterval(App.getMyFusePools, 5 * 60 * 1000);
      } */

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
              priceOracle = $('#DeployPoolPriceOracle').val(); // TODO: Correct public PreferredPriceOracle and public UniswapView addresses

              if (priceOracle === "PreferredPriceOracle" && confirm("Would you like to use the public PreferredPriceOracle? There is no reason to say no unless you need to use SushiSwap (or another Uniswap V2 fork) or you need to set fixed prices for tokens other than WETH.")) priceOracle = "0xdE7E1E556170638dB17a4733d545a3077614ad2d";
              if (priceOracle === "UniswapView" && confirm("Would you like to use the public UniswapView? There is no reason to say no unless you need to use SushiSwap (or another Uniswap V2 fork) or you need to set fixed prices for tokens other than WETH.")) priceOracle = "0xdE7E1E556170638dB17a4733d545a3077614ad2d";
              if (priceOracle === "UniswapAnchoredView" && confirm("Would you like to use the public UniswapAnchoredView? Say yes to use Coinbase Pro as a reporter, and say no to user another price oracle as a reporter.")) priceOracle = "0xdE7E1E556170638dB17a4733d545a3077614ad2d";
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
                interestRateModel: $('#DeployAssetInterestRateModel').val(),
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
                var _yield$App$fuse$deplo3, _yield$App$fuse$deplo4, assetAddress, implementationAddress, interestRateModel;

                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.prev = 0;
                        _context8.next = 3;
                        return App.fuse.deployAsset(conf, collateralFactor, reserveFactor, adminFee, {
                          from: App.selectedAccount
                        });

                      case 3:
                        _yield$App$fuse$deplo3 = _context8.sent;
                        _yield$App$fuse$deplo4 = _slicedToArray(_yield$App$fuse$deplo3, 3);
                        assetAddress = _yield$App$fuse$deplo4[0];
                        implementationAddress = _yield$App$fuse$deplo4[1];
                        interestRateModel = _yield$App$fuse$deplo4[2];
                        _context8.next = 13;
                        break;

                      case 10:
                        _context8.prev = 10;
                        _context8.t0 = _context8["catch"](0);
                        return _context8.abrupt("return", toastr["error"]("Deployment of asset to Fuse pool failed: " + (_context8.t0.message ? _context8.t0.message : _context8.t0), "Deployment failed"));

                      case 13:
                        // Mixpanel
                        if (typeof mixpanel !== 'undefined') mixpanel.track("Asset deployed to pool", _objectSpread(_objectSpread({
                          assetAddress: assetAddress,
                          implementationAddress: implementationAddress,
                          interestRateModel: interestRateModel
                        }, conf), {}, {
                          collateralFactor: collateralFactor,
                          reserveFactor: reserveFactor,
                          adminFee: adminFee
                        })); // Alert success and refresh balances

                        toastr["success"]("Deployment of asset to Fuse pool confirmed! Contract address: " + assetAddress, "Deployment successful");

                      case 15:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8, null, [[0, 10]]);
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
              return App.contracts.FusePoolDirectory.methods.getPublicPoolsWithData().call();

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
                html += '<tr data-id="' + indexes[i] + '" data-name="' + pools[i].name + '" data-comptroller="' + pools[i].comptroller + '"><td scope="row">#' + (i + 1) + '</td><td><a href="https://etherscan.io/address/' + pools[i].comptroller + '">' + pools[i].name + '</a></td><td><a href="https://etherscan.io/address/' + pools[i].creator + '">' + pools[i].creator + '</a></td><td>' + new Big(totalSupplyEth[i]).div(1e18).toFormat(4) + ' ETH</td><td>' + new Big(totalBorrowEth[i]).div(1e18).toFormat(4) + ' ETH</td><td class="text-danger">Unverified</td><td class="text-right">' + new Date(pools[i].timestampPosted * 1000).toISOString() + '</td></tr>';
              }

              $('.pools-table-public tbody').html(html); // Add pool asset click handlers

              App.bindPoolTableEvents('.pools-table-public');

            case 18:
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
              return App.contracts.FusePoolDirectory.methods.getPoolsByAccountWithData(App.selectedAccount).call();

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
                html += '<tr data-id="' + indexes[i] + '" data-name="' + pools[i].name + '" data-comptroller="' + pools[i].comptroller + '"><td scope="row">#' + (i + 1) + '</td><td><a href="https://etherscan.io/address/' + pools[i].comptroller + '">' + pools[i].name + '</a></td><td>' + new Big(totalSupplyEth[i]).div(1e18).toFormat(4) + ' ETH</td><td>' + new Big(totalBorrowEth[i]).div(1e18).toFormat(4) + ' ETH</td><td>' + (pools[i].isPrivate ? "Private" : "Public") + '</td><td class="text-danger">Unverified</td><td class="text-right">' + new Date(pools[i].timestampPosted * 1000).toISOString() + '</td></tr>';
              }

              $('.pools-table-private tbody').html(html);
              html = '<option selected disabled>Select a pool...</option>';

              for (i = 0; i < pools.length; i++) {
                html += '<option value="' + pools[i].comptroller + '" data-id="' + indexes[i] + '">' + pools[i].name + '</option>';
              }

              $('#DeployAssetPool').html(html); // Add pool asset click handlers

              App.bindPoolTableEvents('.pools-table-private');

            case 21:
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
   * Adds click handlers to pool assets.
   */
  bindPoolTableEvents: function bindPoolTableEvents(selector) {
    // Pool click handlers
    $(selector + ' tbody tr').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23() {
      var comptroller, cTokens, html, i, underlyingDecimals, data, borrowers, closeFactor, liquidationIncentive, _iterator, _step, borrower, _iterator2, _step2, asset, underlyingDebtPrice, underlyingCollateralPrice, liquidationAmount, seizeAmountEth, seizeAmount, expectedCollateral, actualCollateral, minSeizeAmount, expectedGasAmount, gasPrice, expectedGasFee, expectedRevenue, expectedProfit;

      return regeneratorRuntime.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              // Set pool name
              $('.pool-detailed-name').text($(this).data("name")); // Add assets to tables

              comptroller = $(this).data("comptroller");
              _context23.next = 4;
              return App.contracts.FusePoolDirectory.methods.getPoolAssetsWithData(comptroller).call({
                from: App.selectedAccount
              });

            case 4:
              cTokens = _context23.sent;
              html = '';

              for (i = 0; i < cTokens.length; i++) {
                underlyingDecimals = parseInt(cTokens[i].underlyingDecimals);
                html += '<tr data-ctoken="' + cTokens[i].cToken + '" data-underlying="' + cTokens[i].underlyingToken + '" data-symbol="' + cTokens[i].underlyingSymbol + '" data-decimals="' + cTokens[i].underlyingDecimals + '"><td scope="row">' + cTokens[i].underlyingName + '</td><td>' + cTokens[i].underlyingSymbol + '</td><td>' + new Big(cTokens[i].supplyRatePerBlock).mul(2372500).div(1e16).toFormat(2) + '</td><td>' + new Big(cTokens[i].totalSupply).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].supplyBalance).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].underlyingBalance).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input collateral-switch" data-comptroller="' + comptroller + '" id="collateral-switch-' + (i + 1) + '"' + (cTokens[i].membership ? " checked" : "") + '><label class="custom-control-label" for="collateral-switch-' + (i + 1) + '">Collateral</label></div></td><td><button type="button" class="btn btn-success btn-sm button-deposit">Deposit</button><button type="button" class="btn btn-danger btn-sm button-withdraw">Withdraw</button></td></tr>';
              }

              $('.pool-detailed-table-assets-supply tbody').html(html);
              html = '';

              for (i = 0; i < cTokens.length; i++) {
                underlyingDecimals = parseInt(cTokens[i].underlyingDecimals);
                html += '<tr data-ctoken="' + cTokens[i].cToken + '" data-underlying="' + cTokens[i].underlyingToken + '" data-symbol="' + cTokens[i].underlyingSymbol + '" data-decimals="' + cTokens[i].underlyingDecimals + '"><td scope="row">' + cTokens[i].underlyingName + '</td><td>' + cTokens[i].underlyingSymbol + '</td><td>' + new Big(cTokens[i].borrowRatePerBlock).mul(2372500).div(1e16).toFormat(2) + '</td><td>' + new Big(cTokens[i].totalBorrow).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].borrowBalance).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].underlyingBalance).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td>' + new Big(cTokens[i].liquidity).div(new Big(10).pow(underlyingDecimals)).toFormat(4) + '</td><td><button type="button" class="btn btn-warning btn-sm button-borrow">Borrow</button><button type="button" class="btn btn-primary btn-sm button-repay">Repay</button></td></tr>';
              }

              $('.pool-detailed-table-assets-borrow tbody').html(html); // Unhealthy accounts table

              _context23.next = 13;
              return App.contracts.FusePoolDirectory.methods.getPoolUsersWithData(comptroller, Web3.utils.toBN(1e18)).call();

            case 13:
              data = _context23.sent;
              borrowers = data["0"];
              borrowers.sort(function (a, b) {
                return parseInt(b.totalBorrow) - parseInt(a.totalBorrow);
              });
              closeFactor = new Big(data["1"]).div(1e18);
              liquidationIncentive = new Big(data["2"]).div(1e18);
              html = '';
              _iterator = _createForOfIteratorHelper(borrowers);
              _context23.prev = 20;

              _iterator.s();

            case 22:
              if ((_step = _iterator.n()).done) {
                _context23.next = 78;
                break;
              }

              borrower = _step.value;
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
                }
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
              });
              borrower.predictions = [];
              borrower.maxLiquidationValue = new Big(borrower.totalBorrow).mul(closeFactor).div(1e18);
              underlyingDebtPrice = new Big(borrower.debt[0].underlyingPrice).div(new Big(10).pow(36 - borrower.debt[0].underlyingDecimals));
              underlyingCollateralPrice = new Big(borrower.collateral[0].underlyingPrice).div(new Big(10).pow(36 - borrower.collateral[0].underlyingDecimals));
              liquidationAmount = borrower.maxLiquidationValue.div(underlyingDebtPrice);
              seizeAmountEth = borrower.maxLiquidationValue.mul(liquidationIncentive);
              seizeAmount = seizeAmountEth.div(underlyingCollateralPrice);
              borrower.predictions.push("Liquidate " + liquidationAmount.toFormat(8) + " " + borrower.debt[0].underlyingSymbol + " (" + borrower.maxLiquidationValue.toFormat(8) + " ETH) debt");
              borrower.predictions.push("Collect " + seizeAmount.toFormat(8) + borrower.collateral[0].underlyingSymbol + " (" + seizeAmountEth.toFormat(8) + " ETH) collateral");
              expectedCollateral = seizeAmountEth;
              actualCollateral = new Big(borrower.collateral[0].supplyBalance).mul(borrower.collateral[0].underlyingPrice).div(1e36);
              minSeizeAmount = new Big(0);

              if (!expectedCollateral.gt(actualCollateral)) {
                _context23.next = 47;
                break;
              }

              borrower.predictions.push('Insufficient collateral.');
              _context23.next = 75;
              break;

            case 47:
              expectedGasAmount = 0;
              _context23.prev = 48;

              if (!(borrower.debt[0].underlyingSymbol === 'ETH')) {
                _context23.next = 55;
                break;
              }

              _context23.next = 52;
              return App.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, borrower.debt[0].cToken, borrower.collateral[0].cToken, 0, borrower.collateral[0].cToken).estimateGas({
                gas: 1e9,
                value: liquidationAmount.mul(new Big(10).pow(parseInt(borrower.debt[0].underlyingDecimals))).toFixed(0),
                from: App.selectedAccount
              });

            case 52:
              expectedGasAmount = _context23.sent;
              _context23.next = 58;
              break;

            case 55:
              _context23.next = 57;
              return App.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, liquidationAmount.mul(new Big(10).pow(parseInt(borrower.debt[0].underlyingDecimals))).toFixed(0), borrower.debt[0].cToken, borrower.collateral[0].cToken, 0, borrower.collateral[0].cToken).estimateGas({
                gas: 1e9,
                from: App.selectedAccount
              });

            case 57:
              expectedGasAmount = _context23.sent;

            case 58:
              _context23.next = 63;
              break;

            case 60:
              _context23.prev = 60;
              _context23.t0 = _context23["catch"](48);
              expectedGasAmount = 600000;

            case 63:
              _context23.t1 = Big;
              _context23.next = 66;
              return App.web3.eth.getGasPrice();

            case 66:
              _context23.t2 = _context23.sent;
              gasPrice = new _context23.t1(_context23.t2).div(1e18);
              expectedGasFee = gasPrice.mul(expectedGasAmount);
              borrower.predictions.push("Gas Amount = " + expectedGasAmount + ", Gas Fee = " + expectedGasFee.toFormat(8) + " ETH");
              expectedRevenue = seizeAmount.mul(underlyingCollateralPrice).sub(liquidationAmount.mul(underlyingDebtPrice));
              borrower.predictions.push("Expected Revenue = " + expectedRevenue.toFormat(8) + "ETH");
              expectedProfit = expectedRevenue.sub(expectedGasFee);
              borrower.predictions.push("Expected Profit = " + expectedProfit.toFormat(8) + "ETH"); // We want expectedProfit = 0, so expectedRevenue = expectedGasFee

              minSeizeAmount = expectedGasFee.add(liquidationAmount.mul(underlyingDebtPrice)).div(underlyingCollateralPrice);

            case 75:
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

            case 76:
              _context23.next = 22;
              break;

            case 78:
              _context23.next = 83;
              break;

            case 80:
              _context23.prev = 80;
              _context23.t3 = _context23["catch"](20);

              _iterator.e(_context23.t3);

            case 83:
              _context23.prev = 83;

              _iterator.f();

              return _context23.finish(83);

            case 86:
              $('.pool-detailed-table-liquidations tbody').html(html); // Switch pages

              $('#page-pools').hide();
              $('#page-pool').show(); // Collateral switch handler

              $('.pool-detailed-table-assets-supply .collateral-switch').change( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                var comptroller;
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        comptroller = new App.web3.eth.Contract(App.comptrollerAbi, $(this).data("comptroller"));

                        if (!$(this).is(':checked')) {
                          _context12.next = 13;
                          break;
                        }

                        _context12.prev = 2;
                        _context12.next = 5;
                        return comptroller.methods.enterMarkets([$(this).closest('tr').data("ctoken")]).send({
                          from: App.selectedAccount
                        });

                      case 5:
                        _context12.next = 11;
                        break;

                      case 7:
                        _context12.prev = 7;
                        _context12.t0 = _context12["catch"](2);
                        $(this).prop("checked", false);
                        return _context12.abrupt("return", toastr["error"]("Entering market failed: " + (_context12.t0.message ? _context12.t0.message : _context12.t0), "Entering market failed"));

                      case 11:
                        _context12.next = 22;
                        break;

                      case 13:
                        _context12.prev = 13;
                        _context12.next = 16;
                        return comptroller.methods.exitMarket($(this).closest('tr').data("ctoken")).send({
                          from: App.selectedAccount
                        });

                      case 16:
                        _context12.next = 22;
                        break;

                      case 18:
                        _context12.prev = 18;
                        _context12.t1 = _context12["catch"](13);
                        $(this).prop("checked", true);
                        return _context12.abrupt("return", toastr["error"]("Exiting market failed: " + (_context12.t1.message ? _context12.t1.message : _context12.t1), "Exiting market failed"));

                      case 22:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12, this, [[2, 7], [13, 18]]);
              }))); // Supply tab button handlers

              $('.pool-detailed-table-assets-supply .button-deposit').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                var token, underlyingSymbol, balance, underlyingDecimals, cToken;
                return regeneratorRuntime.wrap(function _callee14$(_context14) {
                  while (1) {
                    switch (_context14.prev = _context14.next) {
                      case 0:
                        token = new App.web3.eth.Contract(App.erc20Abi, $(this).closest('tr').data("underlying"));
                        underlyingSymbol = $(this).closest('tr').data("symbol");
                        _context14.next = 4;
                        return underlyingSymbol === "ETH" ? App.web3.eth.getBalance(App.selectedAccount) : token.methods.balanceOf(App.selectedAccount).call();

                      case 4:
                        balance = _context14.sent;
                        underlyingDecimals = $(this).closest('tr').data("decimals");
                        $('#modal-deposit #DepositAmount').val(new Big(balance).div(new Big(10).pow(underlyingDecimals)).toFixed());
                        $('#modal-deposit #DepositCurrencyName').val($(this).closest('tr').data("name"));
                        $('#modal-deposit #DepositCurrencySymbol option').text($(this).closest('tr').data("symbol"));
                        $('#modal-deposit').modal('show');
                        cToken = new App.web3.eth.Contract(underlyingSymbol === "ETH" ? App.cEtherAbi : App.cErc20Abi, $(this).closest('tr').data("ctoken"));
                        $('#modal-deposit #depositButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                          var amount;
                          return regeneratorRuntime.wrap(function _callee13$(_context13) {
                            while (1) {
                              switch (_context13.prev = _context13.next) {
                                case 0:
                                  amount = $('#DepositAmount').val();

                                  if (amount) {
                                    _context13.next = 3;
                                    break;
                                  }

                                  return _context13.abrupt("return", toastr["error"]("Invalid deposit amount.", "Deposit failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDecimals)).toFixed(0));

                                  if (!(underlyingSymbol !== "ETH")) {
                                    _context13.next = 13;
                                    break;
                                  }

                                  _context13.prev = 5;
                                  _context13.next = 8;
                                  return token.methods.approve(cToken.options.address, amount).send({
                                    from: App.selectedAccount
                                  });

                                case 8:
                                  _context13.next = 13;
                                  break;

                                case 10:
                                  _context13.prev = 10;
                                  _context13.t0 = _context13["catch"](5);
                                  return _context13.abrupt("return", toastr["error"]("Approval failed: " + (_context13.t0.message ? _context13.t0.message : _context13.t0), "Deposit failed"));

                                case 13:
                                  _context13.prev = 13;
                                  _context13.next = 16;
                                  return underlyingSymbol === "ETH" ? cToken.methods.mint().send({
                                    from: App.selectedAccount,
                                    value: amount
                                  }) : cToken.methods.mint(amount).send({
                                    from: App.selectedAccount
                                  });

                                case 16:
                                  _context13.next = 21;
                                  break;

                                case 18:
                                  _context13.prev = 18;
                                  _context13.t1 = _context13["catch"](13);
                                  return _context13.abrupt("return", toastr["error"]("Deposit failed: " + (_context13.t1.message ? _context13.t1.message : _context13.t1), "Deposit failed"));

                                case 21:
                                  $('#modal-deposit').modal('hide');

                                case 22:
                                case "end":
                                  return _context13.stop();
                              }
                            }
                          }, _callee13, null, [[5, 10], [13, 18]]);
                        })));

                      case 12:
                      case "end":
                        return _context14.stop();
                    }
                  }
                }, _callee14, this);
              })));
              $('.pool-detailed-table-assets-supply .button-withdraw').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16() {
                var cToken, balance, underlyingDecimals;
                return regeneratorRuntime.wrap(function _callee16$(_context16) {
                  while (1) {
                    switch (_context16.prev = _context16.next) {
                      case 0:
                        cToken = new App.web3.eth.Contract(App.cErc20Abi, $(this).closest('tr').data("ctoken"));
                        _context16.next = 3;
                        return cToken.methods.balanceOfUnderlying(App.selectedAccount).call();

                      case 3:
                        balance = _context16.sent;
                        underlyingDecimals = $(this).closest('tr').data("decimals");
                        $('#modal-withdraw #WithdrawAmount').val(new Big(balance).div(new Big(10).pow(underlyingDecimals)).toFixed());
                        $('#modal-withdraw #WithdrawCurrencyName').val($(this).closest('tr').data("name"));
                        $('#modal-withdraw #WithdrawCurrencySymbol option').text($(this).closest('tr').data("symbol"));
                        $('#modal-withdraw').modal('show');
                        $('#modal-withdraw #withdrawButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
                          var amount;
                          return regeneratorRuntime.wrap(function _callee15$(_context15) {
                            while (1) {
                              switch (_context15.prev = _context15.next) {
                                case 0:
                                  amount = $('#WithdrawAmount').val();

                                  if (amount) {
                                    _context15.next = 3;
                                    break;
                                  }

                                  return _context15.abrupt("return", toastr["error"]("Invalid withdrawal amount.", "Withdrawal failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDecimals)).toFixed(0));
                                  _context15.prev = 4;
                                  _context15.next = 7;
                                  return cToken.methods.redeemUnderlying(amount).send({
                                    from: App.selectedAccount
                                  });

                                case 7:
                                  _context15.next = 12;
                                  break;

                                case 9:
                                  _context15.prev = 9;
                                  _context15.t0 = _context15["catch"](4);
                                  return _context15.abrupt("return", toastr["error"]("Withdrawal failed: " + (_context15.t0.message ? _context15.t0.message : _context15.t0), "Withdrawal failed"));

                                case 12:
                                  $('#modal-withdraw').modal('hide');

                                case 13:
                                case "end":
                                  return _context15.stop();
                              }
                            }
                          }, _callee15, null, [[4, 9]]);
                        })));

                      case 10:
                      case "end":
                        return _context16.stop();
                    }
                  }
                }, _callee16, this);
              }))); // Borrow tab button handlers

              $('.pool-detailed-table-assets-borrow .button-borrow').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
                var underlyingDecimals, cToken;
                return regeneratorRuntime.wrap(function _callee18$(_context18) {
                  while (1) {
                    switch (_context18.prev = _context18.next) {
                      case 0:
                        // TODO: Get max borrow?
                        $('#modal-borrow #BorrowCurrencyName').val($(this).closest('tr').data("name"));
                        $('#modal-borrow #BorrowCurrencySymbol option').text($(this).closest('tr').data("symbol"));
                        $('#modal-borrow').modal('show');
                        underlyingDecimals = $(this).closest('tr').data("decimals");
                        cToken = new App.web3.eth.Contract(App.cErc20Abi, $(this).closest('tr').data("ctoken"));
                        $('#modal-borrow #borrowButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
                          var amount;
                          return regeneratorRuntime.wrap(function _callee17$(_context17) {
                            while (1) {
                              switch (_context17.prev = _context17.next) {
                                case 0:
                                  amount = $('#BorrowAmount').val();

                                  if (amount) {
                                    _context17.next = 3;
                                    break;
                                  }

                                  return _context17.abrupt("return", toastr["error"]("Invalid borrow amount.", "Borrow failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDecimals)).toFixed(0));
                                  _context17.prev = 4;
                                  _context17.next = 7;
                                  return cToken.methods.borrow(amount).send({
                                    from: App.selectedAccount
                                  });

                                case 7:
                                  _context17.next = 12;
                                  break;

                                case 9:
                                  _context17.prev = 9;
                                  _context17.t0 = _context17["catch"](4);
                                  return _context17.abrupt("return", toastr["error"]("Borrow failed: " + (_context17.t0.message ? _context17.t0.message : _context17.t0), "Borrow failed"));

                                case 12:
                                  $('#modal-borrow').modal('hide');

                                case 13:
                                case "end":
                                  return _context17.stop();
                              }
                            }
                          }, _callee17, null, [[4, 9]]);
                        })));

                      case 6:
                      case "end":
                        return _context18.stop();
                    }
                  }
                }, _callee18, this);
              })));
              $('.pool-detailed-table-assets-borrow .button-repay').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
                var underlyingSymbol, cToken, balance, underlyingDecimals, token;
                return regeneratorRuntime.wrap(function _callee20$(_context20) {
                  while (1) {
                    switch (_context20.prev = _context20.next) {
                      case 0:
                        underlyingSymbol = $(this).closest('tr').data("symbol");
                        cToken = new App.web3.eth.Contract(underlyingSymbol === "ETH" ? App.cEtherAbi : App.cErc20Abi, $(this).closest('tr').data("ctoken"));
                        _context20.next = 4;
                        return cToken.methods.borrowBalanceCurrent(App.selectedAccount).call();

                      case 4:
                        balance = _context20.sent;
                        underlyingDecimals = $(this).closest('tr').data("decimals");
                        $('#modal-repay #RepayAmount').val(new Big(balance).div(new Big(10).pow(underlyingDecimals)).toFixed());
                        $('#modal-repay #RepayCurrencyName').val($(this).closest('tr').data("name"));
                        $('#modal-repay #RepayCurrencySymbol option').text($(this).closest('tr').data("symbol"));
                        $('#modal-repay').modal('show');
                        token = new App.web3.eth.Contract(App.erc20Abi, $(this).closest('tr').data("underlying"));
                        $('#modal-repay #repayButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19() {
                          var amount;
                          return regeneratorRuntime.wrap(function _callee19$(_context19) {
                            while (1) {
                              switch (_context19.prev = _context19.next) {
                                case 0:
                                  amount = $('#RepayAmount').val();

                                  if (amount) {
                                    _context19.next = 3;
                                    break;
                                  }

                                  return _context19.abrupt("return", toastr["error"]("Invalid repayment amount.", "Repayment failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDecimals)).toFixed(0));

                                  if (!(underlyingSymbol !== "ETH")) {
                                    _context19.next = 13;
                                    break;
                                  }

                                  _context19.prev = 5;
                                  _context19.next = 8;
                                  return token.methods.approve(cToken.options.address, amount).send({
                                    from: App.selectedAccount
                                  });

                                case 8:
                                  _context19.next = 13;
                                  break;

                                case 10:
                                  _context19.prev = 10;
                                  _context19.t0 = _context19["catch"](5);
                                  return _context19.abrupt("return", toastr["error"]("Approval failed: " + (_context19.t0.message ? _context19.t0.message : _context19.t0), "Repayment failed"));

                                case 13:
                                  _context19.prev = 13;
                                  _context19.next = 16;
                                  return underlyingSymbol === "ETH" ? cToken.methods.repayBorrow().send({
                                    from: App.selectedAccount,
                                    value: amount
                                  }) : cToken.methods.repayBorrow(amount).send({
                                    from: App.selectedAccount
                                  });

                                case 16:
                                  _context19.next = 21;
                                  break;

                                case 18:
                                  _context19.prev = 18;
                                  _context19.t1 = _context19["catch"](13);
                                  return _context19.abrupt("return", toastr["error"]("Repayment failed: " + (_context19.t1.message ? _context19.t1.message : _context19.t1), "Repayment failed"));

                                case 21:
                                  $('#modal-repay').modal('hide');

                                case 22:
                                case "end":
                                  return _context19.stop();
                              }
                            }
                          }, _callee19, null, [[5, 10], [13, 18]]);
                        })));

                      case 12:
                      case "end":
                        return _context20.stop();
                    }
                  }
                }, _callee20, this);
              }))); // Liquidation button handler

              $('.pool-detailed-table-liquidations .button-liquidate').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
                var debtCToken, underlyingDebtToken, underlyingDebtSymbol, underlyingDebtDecimals, liquidationAmount, collateralCToken, underlyingCollateralToken, underlyingCollateralSymbol, underlyingCollateralDecimals, minSeize, debtToken;
                return regeneratorRuntime.wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
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
                          $(this).val() === "other" ? $('#LiquidateExchangeProfitTo').show() : $('#LiquidateExchangeProfitTo').hide();
                        });
                        $('#modal-liquidate #liquidateButton').off('click').click( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
                          var amount, exchangeProfitTo, exchangeProfitToDecimals, liquidateMethod, minProfit, minSeize;
                          return regeneratorRuntime.wrap(function _callee21$(_context21) {
                            while (1) {
                              switch (_context21.prev = _context21.next) {
                                case 0:
                                  // Validate amount
                                  amount = $('#LiquidateAmount').val();

                                  if (amount) {
                                    _context21.next = 3;
                                    break;
                                  }

                                  return _context21.abrupt("return", toastr["error"]("Invalid liquidation amount.", "Liquidation failed"));

                                case 3:
                                  amount = Web3.utils.toBN(new Big(amount).mul(new Big(10).pow(underlyingDebtDecimals)).toFixed(0)); // Validate exchangeProfitTo

                                  exchangeProfitTo = $('#modal-liquidate #LiquidateProfitCurrencySymbol').val();
                                  if (exchangeProfitTo == "collateral") exchangeProfitTo = underlyingCollateralToken;else if (exchangeProfitTo == "debt") exchangeProfitTo = underlyingDebtToken;else if (exchangeProfitTo == "eth") exchangeProfitTo = "0x0000000000000000000000000000000000000000";else exchangeProfitTo = $('#LiquidateExchangeProfitTo').val();

                                  if (exchangeProfitTo) {
                                    _context21.next = 8;
                                    break;
                                  }

                                  return _context21.abrupt("return", toastr["error"]("No destination currency specified for seized collateral.", "Liquidation failed"));

                                case 8:
                                  // Get exchangeProfitTo decimal precision
                                  exchangeProfitToDecimals = 18;

                                  if (!(exchangeProfitTo !== "0x0000000000000000000000000000000000000000")) {
                                    _context21.next = 21;
                                    break;
                                  }

                                  _context21.prev = 10;
                                  _context21.t0 = parseInt;
                                  _context21.next = 14;
                                  return new App.web3.eth.Contract(App.erc20Abi, exchangeProfitTo).methods.decimals().call();

                                case 14:
                                  _context21.t1 = _context21.sent;
                                  exchangeProfitToDecimals = (0, _context21.t0)(_context21.t1);
                                  _context21.next = 21;
                                  break;

                                case 18:
                                  _context21.prev = 18;
                                  _context21.t2 = _context21["catch"](10);
                                  return _context21.abrupt("return", toastr["error"]("Failed to retrieve decimal precision of exchange output token.", "Liquidation failed"));

                                case 21:
                                  // Validate method (flashloan or no flashloan)
                                  liquidateMethod = $('#modal-liquidate #LiquidateMethod').val();

                                  if (!(liquidateMethod === "uniswap")) {
                                    _context21.next = 35;
                                    break;
                                  }

                                  // Liquidate via flashloan
                                  minProfit = $('#LiquidateMinProfit').val();
                                  if (!minProfit) minProfit = Web3.utils.toBN(0);else minProfit = Web3.utils.toBN(new Big(minProfit).mul(new Big(10).pow(exchangeProfitToDecimals)).toFixed(0));
                                  _context21.prev = 25;
                                  _context21.next = 28;
                                  return underlyingDebtSymbol === "ETH" ? App.contracts.FuseSafeLiquidator.methods.safeLiquidateToEthWithFlashLoan(borrower.account, amount, debtCToken, collateralCToken, minProfit, exchangeProfitTo).send({
                                    from: App.selectedAccount
                                  }) : App.contracts.FuseSafeLiquidator.methods.safeLiquidateToTokensWithFlashLoan(borrower.account, amount, debtCToken, collateralCToken, minProfit, exchangeProfitTo).send({
                                    from: App.selectedAccount
                                  });

                                case 28:
                                  _context21.next = 33;
                                  break;

                                case 30:
                                  _context21.prev = 30;
                                  _context21.t3 = _context21["catch"](25);
                                  return _context21.abrupt("return", toastr["error"]("Liquidation failed: " + (_context21.t3.message ? _context21.t3.message : _context21.t3), "Liquidation failed"));

                                case 33:
                                  _context21.next = 54;
                                  break;

                                case 35:
                                  // Liquidate using local capital
                                  minSeize = $('#LiquidateMinSeize').val();
                                  if (!minSeize) minSeize = Web3.utils.toBN(0);else minSeize = Web3.utils.toBN(new Big(minSeize).mul(new Big(10).pow(exchangeProfitToDecimals)).toFixed(0));

                                  if (!(underlyingDebtSymbol !== "ETH")) {
                                    _context21.next = 46;
                                    break;
                                  }

                                  _context21.prev = 38;
                                  _context21.next = 41;
                                  return debtToken.methods.approve(App.contracts.FuseSafeLiquidator.options.address, amount).send({
                                    from: App.selectedAccount
                                  });

                                case 41:
                                  _context21.next = 46;
                                  break;

                                case 43:
                                  _context21.prev = 43;
                                  _context21.t4 = _context21["catch"](38);
                                  return _context21.abrupt("return", toastr["error"]("Approval failed: " + (_context21.t4.message ? _context21.t4.message : _context21.t4), "Liquidation failed"));

                                case 46:
                                  _context21.prev = 46;
                                  _context21.next = 49;
                                  return underlyingDebtSymbol === "ETH" ? App.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, debtCToken, collateralCToken, minSeize, exchangeProfitTo).send({
                                    from: App.selectedAccount,
                                    value: amount
                                  }) : App.contracts.FuseSafeLiquidator.methods.safeLiquidate(borrower.account, amount, debtCToken, collateralCToken, minSeize, exchangeProfitTo).send({
                                    from: App.selectedAccount
                                  });

                                case 49:
                                  _context21.next = 54;
                                  break;

                                case 51:
                                  _context21.prev = 51;
                                  _context21.t5 = _context21["catch"](46);
                                  return _context21.abrupt("return", toastr["error"]("Liquidation failed: " + (_context21.t5.message ? _context21.t5.message : _context21.t5), "Liquidation failed"));

                                case 54:
                                  // Hide modal
                                  $('#modal-repay').modal('hide');

                                case 55:
                                case "end":
                                  return _context21.stop();
                              }
                            }
                          }, _callee21, null, [[10, 18], [25, 30], [38, 43], [46, 51]]);
                        })));

                      case 28:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22, this);
              })));

            case 95:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23, this, [[20, 80, 83, 86], [48, 60]]);
    })));
  }
};
$(function () {
  $(document).ready(function () {
    App.init();
  });
});
