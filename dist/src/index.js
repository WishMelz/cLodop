var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { DEFAULT_CONFIG } from './type';
//用双端口加载主JS文件Lodop.js(或CLodopfuncs.js兼容老版本)以防其中某端口被占:
// export const MainJS = "CLodopfuncs.js";
// export const URL_WS1 = `ws://localhost:8000/${MainJS}`;           // ws用8000/18000
// export const URL_WS2 = `ws://localhost:18000/${MainJS}`;
// export const URL_HTTP1 = `http://localhost:8000/${MainJS}`;       // http用8000/18000
// export const URL_HTTP2 = `http://localhost:18000/${MainJS}`;
// export const URL_HTTP3 = `https://localhost.lodop.net:8443/${MainJS}`; // https用8000/8443
var MainJS;
var URL_WS1;
var URL_WS2;
var URL_HTTP1;
var URL_HTTP2;
var URL_HTTP3;
var CreatedOKLodopObject;
var CLodopIsLocal;
var LoadJsState;
function updateUrls(config) {
    console.log('clodop config:', config);
    window.LodopToken = config.token;
    MainJS = config.mainJS;
    URL_WS1 = "ws://localhost:".concat(config.wsPort1, "/").concat(MainJS);
    URL_WS2 = "ws://localhost:".concat(config.wsPort2, "/").concat(MainJS);
    URL_HTTP1 = "http://localhost:".concat(config.httpPort1, "/").concat(MainJS);
    URL_HTTP2 = "http://localhost:".concat(config.httpPort2, "/").concat(MainJS);
    URL_HTTP3 = "https://localhost.lodop.net:".concat(config.httpsPort, "/").concat(MainJS);
}
// 初始化默认值
updateUrls(DEFAULT_CONFIG);
// 判断是否需要CLodop(那些不支持插件的浏览器)
export function needCLodop() {
    try {
        var ua = navigator.userAgent;
        if (ua.match(/Windows\sPhone/i) ||
            ua.match(/iPhone|iPod|iPad/i) ||
            ua.match(/Android/i) ||
            ua.match(/Edge\D?\d+/i)) {
            return true;
        }
        var verTrident = ua.match(/Trident\D?\d+/i);
        var verIE = ua.match(/MSIE\D?\d+/i);
        var verOPR = ua.match(/OPR\D?\d+/i);
        var verFF = ua.match(/Firefox\D?\d+/i);
        var x64 = ua.match(/x64/i);
        if (!verTrident && !verIE && x64)
            return true;
        if (verFF) {
            var version = verFF[0].match(/\d+/);
            if (version && (parseInt(version[0]) >= 41 || x64))
                return true;
        }
        else if (verOPR) {
            var version = verOPR[0].match(/\d+/);
            if (version && parseInt(version[0]) >= 32)
                return true;
        }
        else if (!verTrident && !verIE) {
            var verChrome = ua.match(/Chrome\D?\d+/i);
            if (verChrome) {
                var version = verChrome[0].match(/\d+/);
                if (version && parseInt(version[0]) >= 41)
                    return true;
            }
        }
        return false;
    }
    catch (err) {
        return true;
    }
}
export function checkOrTryHttp() {
    if (window === null || window === void 0 ? void 0 : window.getCLodop) {
        LoadJsState = 'complete';
        return true;
    }
    if (LoadJsState === 'loadingB' || LoadJsState === 'complete')
        return false;
    LoadJsState = 'loadingB';
    var head = document.head ||
        document.getElementsByTagName('head')[0] ||
        document.documentElement;
    var JS1 = document.createElement('script');
    var JS2 = document.createElement('script');
    var JS3 = document.createElement('script');
    JS1.src = URL_HTTP1;
    JS2.src = URL_HTTP2;
    JS3.src = URL_HTTP3;
    var completeHandler = function () {
        LoadJsState = 'complete';
    };
    JS1.onload =
        JS2.onload =
            JS3.onload =
                JS2.onerror =
                    JS3.onerror =
                        completeHandler;
    JS1.onerror = function () {
        if (window.location.protocol !== 'https:') {
            head.insertBefore(JS2, head.firstChild);
        }
        else {
            head.insertBefore(JS3, head.firstChild);
        }
    };
    head.insertBefore(JS1, head.firstChild);
    return false;
}
// 加载Lodop对象的主过程
export function initialize(config) {
    if (config) {
        // 合并配置
        var mergedConfig = __assign(__assign({}, DEFAULT_CONFIG), config);
        console.log('clodop mergedConfig:', mergedConfig);
        // 更新URLs
        updateUrls(mergedConfig);
    }
    if (!needCLodop())
        return;
    CLodopIsLocal = !!(URL_WS1 + URL_WS2).match(/\/\/localho|\/\/127.0.0./i);
    LoadJsState = 'loadingA';
    if (!window.WebSocket && window.MozWebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    try {
        var WSK1 = new WebSocket(URL_WS1);
        WSK1.onopen = function () {
            setTimeout(checkOrTryHttp, 200);
        };
        WSK1.onmessage = function (e) {
            if (!window.getCLodop)
                eval(e.data);
        };
        WSK1.onerror = function () {
            var WSK2 = new WebSocket(URL_WS2);
            WSK2.onopen = function () {
                setTimeout(checkOrTryHttp, 200);
            };
            WSK2.onmessage = function (e) {
                if (!window.getCLodop)
                    eval(e.data);
            };
            WSK2.onerror = function () {
                checkOrTryHttp();
            };
        };
    }
    catch (e) {
        checkOrTryHttp();
    }
}
export function getLodop(oOBJECT, oEMBED) {
    // Installation messages
    var strFontTag = "<br><font color='#FF00FF'>打印控件";
    var strLodopInstall = strFontTag +
        "未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>";
    var strLodopUpdate = strFontTag +
        "需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>";
    var strLodop64Install = strFontTag +
        "未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>";
    var strLodop64Update = strFontTag +
        "需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>";
    var strCLodopInstallA = "<br><font color='#FF00FF'>Web打印服务CLodop未安装启动，点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>下载执行安装</a>";
    var strCLodopInstallB = "<br>（若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>）";
    var strCLodopUpdate = "<br><font color='#FF00FF'>Web打印服务CLodop需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>";
    var strLodop7FontTag = "<br><font color='#FF00FF'>Web打印服务Lodop7";
    var strLodop7HrefX86 = "点击这里<a href='Lodop7_Linux_X86_64.tar.gz' target='_self'>下载安装</a>(下载后解压，点击lodop文件开始执行)";
    var strLodop7HrefARM = "点击这里<a href='Lodop7_Linux_ARM64.tar.gz'  target='_self'>下载安装</a>(下载后解压，点击lodop文件开始执行)";
    var strLodop7Install_X86 = strLodop7FontTag + '未安装启动，' + strLodop7HrefX86;
    var strLodop7Install_ARM = strLodop7FontTag + '未安装启动，' + strLodop7HrefARM;
    var strLodop7Update_X86 = strLodop7FontTag + '需升级，' + strLodop7HrefX86;
    var strLodop7Update_ARM = strLodop7FontTag + '需升级，' + strLodop7HrefARM;
    var strInstallOK = '，成功后请刷新本页面或重启浏览器。</font>';
    try {
        // Detect OS and browser
        var detection = {
            isWinIE: /MSIE/i.test(navigator.userAgent) ||
                /Trident/i.test(navigator.userAgent),
            isWinIE64: false,
            isLinuxX86: /Linux/i.test(navigator.platform) &&
                /x86/i.test(navigator.platform),
            isLinuxARM: /Linux/i.test(navigator.platform) &&
                /aarch/i.test(navigator.platform),
        };
        detection.isWinIE64 =
            detection.isWinIE && /x64/i.test(navigator.userAgent);
        var LODOP 
        // 检查是否已存在提示元素
        = void 0;
        // 检查是否已存在提示元素
        var existingTip = document.getElementById('lodop-tip');
        if (existingTip) {
            existingTip.remove();
        }
        // 创建新的提示元素
        var tipElement = document.createElement('div');
        tipElement.id = 'lodop-tip';
        if (needCLodop() || detection.isLinuxX86 || detection.isLinuxARM) {
            try {
                LODOP = window.getCLodop();
            }
            catch (err) { }
            if (!LODOP && LoadJsState !== 'complete') {
                if (!LoadJsState) {
                    alert('未曾加载Lodop主JS文件，请先调用loadCLodop过程.');
                }
                else {
                    alert('网页还没下载完毕，请稍等一下再操作.');
                }
                return;
            }
            var strAlertMessage = '';
            if (!LODOP) {
                if (detection.isLinuxX86)
                    strAlertMessage = strLodop7Install_X86;
                else if (detection.isLinuxARM)
                    strAlertMessage = strLodop7Install_ARM;
                else
                    strAlertMessage =
                        strCLodopInstallA +
                            (CLodopIsLocal ? strCLodopInstallB : '');
                tipElement.innerHTML = strAlertMessage + strInstallOK;
                document.body.insertBefore(tipElement, document.body.firstChild);
                return;
            }
            else {
                if (detection.isLinuxX86 && LODOP.CVERSION < '7.0.9.8') {
                    strAlertMessage = strLodop7Update_X86;
                }
                else if (detection.isLinuxARM && LODOP.CVERSION < '7.0.9.8') {
                    strAlertMessage = strLodop7Update_ARM;
                }
                else if (window.CLODOP.CVERSION < '6.6.1.1') {
                    strAlertMessage = strCLodopUpdate;
                }
                if (strAlertMessage) {
                    tipElement.innerHTML = strAlertMessage + strInstallOK;
                    document.body.insertBefore(tipElement, document.body.firstChild);
                }
            }
        }
        else {
            //==如果页面有Lodop插件就直接使用,否则新建:==
            if (oOBJECT || oEMBED) {
                if (detection.isWinIE)
                    LODOP = oOBJECT;
                else
                    LODOP = oEMBED;
            }
            else if (!CreatedOKLodopObject) {
                LODOP = document.createElement('object');
                LODOP.setAttribute('width', '0');
                LODOP.setAttribute('height', '0');
                LODOP.setAttribute('style', 'position:absolute;left:0px;top:-100px;width:0px;height:0px;');
                if (detection.isWinIE) {
                    LODOP.setAttribute('classid', 'clsid:2105C259-1E0C-4534-8141-A753534CB4CA');
                }
                else {
                    LODOP.setAttribute('type', 'application/x-print-lodop');
                }
                document.documentElement.appendChild(LODOP);
                CreatedOKLodopObject = LODOP;
            }
            else {
                LODOP = CreatedOKLodopObject;
            }
            //==Lodop插件未安装时提示下载地址:==
            if ((!LODOP) || (!LODOP.VERSION)) {
                tipElement.innerHTML = (detection.isWinIE64 ? strLodop64Install : strLodopInstall) + strInstallOK;
                document.body.insertBefore(tipElement, document.body.firstChild);
                return LODOP;
            }
            if (LODOP.VERSION < "6.2.2.6") {
                tipElement.innerHTML = (detection.isWinIE64 ? strLodop64Update : strLodopUpdate) + strInstallOK;
                document.body.insertBefore(tipElement, document.body.firstChild);
            }
        }
        console.log('当前TOKEN：', window.LodopToken);
        LODOP.SET_LICENSES('', window.LodopToken, '', '');
        return LODOP;
    }
    catch (err) {
        alert('getLodop出错:' + err);
    }
}
