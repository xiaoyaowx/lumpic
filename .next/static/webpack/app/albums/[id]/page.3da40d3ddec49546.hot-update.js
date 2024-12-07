"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/albums/[id]/page",{

/***/ "(app-pages-browser)/./src/app/albums/[id]/page.tsx":
/*!**************************************!*\
  !*** ./src/app/albums/[id]/page.tsx ***!
  \**************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ AlbumPage; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/react */ \"(app-pages-browser)/./node_modules/next-auth/react/index.js\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/navigation */ \"(app-pages-browser)/./node_modules/next/navigation.js\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _components_ImageGrid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/ImageGrid */ \"(app-pages-browser)/./src/components/ImageGrid.tsx\");\n/* harmony import */ var _components_ImageUploader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/components/ImageUploader */ \"(app-pages-browser)/./src/components/ImageUploader.tsx\");\n/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-hot-toast */ \"(app-pages-browser)/./node_modules/react-hot-toast/dist/index.mjs\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/link */ \"(app-pages-browser)/./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_7__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\n\nfunction AlbumPage(param) {\n    let { params } = param;\n    _s();\n    const { data: session, status } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_1__.useSession)();\n    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    const [album, setAlbum] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(true);\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        if (status === \"unauthenticated\") {\n            router.push(\"/login\");\n        } else if (status === \"authenticated\") {\n            fetchAlbumAndImages();\n        }\n    }, [\n        status,\n        params.id\n    ]);\n    const fetchAlbumAndImages = async ()=>{\n        try {\n            const albumResponse = await fetch(\"/api/albums/\".concat(params.id));\n            if (!albumResponse.ok) {\n                throw new Error(\"获取图库信息失败\");\n            }\n            const albumData = await albumResponse.json();\n            setAlbum(albumData);\n        } catch (error) {\n            react_hot_toast__WEBPACK_IMPORTED_MODULE_6__[\"default\"].error(\"获取图库信息失败\");\n            router.push(\"/albums\");\n        } finally{\n            setIsLoading(false);\n        }\n    };\n    const handleUploadSuccess = (newImages)=>{\n        setAlbum((prevAlbum)=>({\n                ...prevAlbum,\n                images: [\n                    ...prevAlbum.images,\n                    ...newImages\n                ]\n            }));\n    };\n    if (isLoading) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"p-6 pt-24\",\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"max-w-7xl mx-auto\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"animate-pulse space-y-4\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"h-8 bg-gray-200 rounded w-1/4\"\n                        }, void 0, false, {\n                            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                            lineNumber: 70,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"h-4 bg-gray-200 rounded w-1/2\"\n                        }, void 0, false, {\n                            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                            lineNumber: 71,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4\",\n                            children: [\n                                ...Array(8)\n                            ].map((_, i)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"aspect-square bg-gray-200 rounded-lg\"\n                                }, i, false, {\n                                    fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                                    lineNumber: 74,\n                                    columnNumber: 17\n                                }, this))\n                        }, void 0, false, {\n                            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                            lineNumber: 72,\n                            columnNumber: 13\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                    lineNumber: 69,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                lineNumber: 68,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n            lineNumber: 67,\n            columnNumber: 7\n        }, this);\n    }\n    if (!album) {\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"p-6 pt-24\",\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"max-w-7xl mx-auto\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"text-center py-12\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                            className: \"text-2xl font-semibold text-gray-900\",\n                            children: \"图库不存在\"\n                        }, void 0, false, {\n                            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                            lineNumber: 88,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                            className: \"mt-2 text-gray-600\",\n                            children: \"该图库可能已被删除或您没有访问权限\"\n                        }, void 0, false, {\n                            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                            lineNumber: 89,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_7___default()), {\n                            href: \"/albums\",\n                            className: \"mt-4 inline-block text-blue-500 hover:text-blue-600\",\n                            children: \"返回图库列表\"\n                        }, void 0, false, {\n                            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                            lineNumber: 90,\n                            columnNumber: 13\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                    lineNumber: 87,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                lineNumber: 86,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n            lineNumber: 85,\n            columnNumber: 7\n        }, this);\n    }\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"p-6 pt-24\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"max-w-7xl mx-auto\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"mb-8\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"flex items-center justify-between\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"flex items-center space-x-4\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                                                className: \"text-2xl font-bold text-gray-900\",\n                                                children: album.name\n                                            }, void 0, false, {\n                                                fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                                                lineNumber: 109,\n                                                columnNumber: 17\n                                            }, this),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                className: \"text-sm text-gray-500\",\n                                                children: [\n                                                    album.images.length,\n                                                    \" 张图片\"\n                                                ]\n                                            }, void 0, true, {\n                                                fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                                                lineNumber: 110,\n                                                columnNumber: 17\n                                            }, this)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                                        lineNumber: 108,\n                                        columnNumber: 15\n                                    }, this),\n                                    album.description && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                        className: \"mt-1 text-gray-500\",\n                                        children: album.description\n                                    }, void 0, false, {\n                                        fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                                        lineNumber: 115,\n                                        columnNumber: 17\n                                    }, this)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                                lineNumber: 107,\n                                columnNumber: 13\n                            }, this),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_7___default()), {\n                                href: \"/albums\",\n                                className: \"text-gray-600 hover:text-gray-900\",\n                                children: \"返回图库列表\"\n                            }, void 0, false, {\n                                fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                                lineNumber: 118,\n                                columnNumber: 13\n                            }, this)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                        lineNumber: 106,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                    lineNumber: 105,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"space-y-8\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ImageUploader__WEBPACK_IMPORTED_MODULE_5__[\"default\"], {\n                            onUploadSuccess: handleUploadSuccess,\n                            albumId: params.id,\n                            buttonText: \"上传图片\",\n                            buttonClassName: \"bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors\"\n                        }, void 0, false, {\n                            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                            lineNumber: 128,\n                            columnNumber: 11\n                        }, this),\n                        album.images.length > 0 ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ImageGrid__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                            images: album.images,\n                            onImageClick: (image)=>router.push(\"/image/\".concat(image.id)),\n                            gridCols: 6\n                        }, void 0, false, {\n                            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                            lineNumber: 136,\n                            columnNumber: 13\n                        }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"text-center py-12 bg-white rounded-lg shadow-sm\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                className: \"text-gray-500\",\n                                children: \"暂无图片，点击上方按钮上传\"\n                            }, void 0, false, {\n                                fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                                lineNumber: 143,\n                                columnNumber: 15\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                            lineNumber: 142,\n                            columnNumber: 13\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n                    lineNumber: 127,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n            lineNumber: 104,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/xiaoyao/Downloads/image_upload/src/app/albums/[id]/page.tsx\",\n        lineNumber: 103,\n        columnNumber: 5\n    }, this);\n}\n_s(AlbumPage, \"wuMZA70zqhfITOEjR2EkWwG3nOQ=\", false, function() {\n    return [\n        next_auth_react__WEBPACK_IMPORTED_MODULE_1__.useSession,\n        next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter\n    ];\n});\n_c = AlbumPage;\nvar _c;\n$RefreshReg$(_c, \"AlbumPage\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvYWxidW1zL1tpZF0vcGFnZS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRTZDO0FBQ0Q7QUFDQTtBQUNHO0FBQ1E7QUFDbkI7QUFDUDtBQWdCZCxTQUFTUSxVQUFVLEtBQXNDO1FBQXRDLEVBQUVDLE1BQU0sRUFBOEIsR0FBdEM7O0lBQ2hDLE1BQU0sRUFBRUMsTUFBTUMsT0FBTyxFQUFFQyxNQUFNLEVBQUUsR0FBR1osMkRBQVVBO0lBQzVDLE1BQU1hLFNBQVNaLDBEQUFTQTtJQUN4QixNQUFNLENBQUNhLE9BQU9DLFNBQVMsR0FBR1osK0NBQVFBLENBQWU7SUFDakQsTUFBTSxDQUFDYSxXQUFXQyxhQUFhLEdBQUdkLCtDQUFRQSxDQUFDO0lBRTNDRCxnREFBU0EsQ0FBQztRQUNSLElBQUlVLFdBQVcsbUJBQW1CO1lBQ2hDQyxPQUFPSyxJQUFJLENBQUM7UUFDZCxPQUFPLElBQUlOLFdBQVcsaUJBQWlCO1lBQ3JDTztRQUNGO0lBQ0YsR0FBRztRQUFDUDtRQUFRSCxPQUFPVyxFQUFFO0tBQUM7SUFFdEIsTUFBTUQsc0JBQXNCO1FBQzFCLElBQUk7WUFDRixNQUFNRSxnQkFBZ0IsTUFBTUMsTUFBTSxlQUF5QixPQUFWYixPQUFPVyxFQUFFO1lBRTFELElBQUksQ0FBQ0MsY0FBY0UsRUFBRSxFQUFFO2dCQUNyQixNQUFNLElBQUlDLE1BQU07WUFDbEI7WUFFQSxNQUFNQyxZQUFZLE1BQU1KLGNBQWNLLElBQUk7WUFFMUNYLFNBQVNVO1FBQ1gsRUFBRSxPQUFPRSxPQUFPO1lBQ2RyQix1REFBS0EsQ0FBQ3FCLEtBQUssQ0FBQztZQUNaZCxPQUFPSyxJQUFJLENBQUM7UUFDZCxTQUFVO1lBQ1JELGFBQWE7UUFDZjtJQUNGO0lBRUEsTUFBTVcsc0JBQXNCLENBQUNDO1FBQzNCZCxTQUFTLENBQUNlLFlBQWU7Z0JBQ3ZCLEdBQUdBLFNBQVM7Z0JBQ1pDLFFBQVE7dUJBQUlELFVBQVVDLE1BQU07dUJBQUtGO2lCQUFVO1lBQzdDO0lBQ0Y7SUFFQSxJQUFJYixXQUFXO1FBQ2IscUJBQ0UsOERBQUNnQjtZQUFJQyxXQUFVO3NCQUNiLDRFQUFDRDtnQkFBSUMsV0FBVTswQkFDYiw0RUFBQ0Q7b0JBQUlDLFdBQVU7O3NDQUNiLDhEQUFDRDs0QkFBSUMsV0FBVTs7Ozs7O3NDQUNmLDhEQUFDRDs0QkFBSUMsV0FBVTs7Ozs7O3NDQUNmLDhEQUFDRDs0QkFBSUMsV0FBVTtzQ0FDWjttQ0FBSUMsTUFBTTs2QkFBRyxDQUFDQyxHQUFHLENBQUMsQ0FBQ0MsR0FBR0Msa0JBQ3JCLDhEQUFDTDtvQ0FBWUMsV0FBVTttQ0FBYkk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBT3hCO0lBRUEsSUFBSSxDQUFDdkIsT0FBTztRQUNWLHFCQUNFLDhEQUFDa0I7WUFBSUMsV0FBVTtzQkFDYiw0RUFBQ0Q7Z0JBQUlDLFdBQVU7MEJBQ2IsNEVBQUNEO29CQUFJQyxXQUFVOztzQ0FDYiw4REFBQ0s7NEJBQUdMLFdBQVU7c0NBQXVDOzs7Ozs7c0NBQ3JELDhEQUFDTTs0QkFBRU4sV0FBVTtzQ0FBcUI7Ozs7OztzQ0FDbEMsOERBQUMxQixrREFBSUE7NEJBQ0hpQyxNQUFLOzRCQUNMUCxXQUFVO3NDQUNYOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBT1g7SUFFQSxxQkFDRSw4REFBQ0Q7UUFBSUMsV0FBVTtrQkFDYiw0RUFBQ0Q7WUFBSUMsV0FBVTs7OEJBQ2IsOERBQUNEO29CQUFJQyxXQUFVOzhCQUNiLDRFQUFDRDt3QkFBSUMsV0FBVTs7MENBQ2IsOERBQUNEOztrREFDQyw4REFBQ0E7d0NBQUlDLFdBQVU7OzBEQUNiLDhEQUFDUTtnREFBR1IsV0FBVTswREFBb0NuQixNQUFNNEIsSUFBSTs7Ozs7OzBEQUM1RCw4REFBQ0M7Z0RBQUtWLFdBQVU7O29EQUNibkIsTUFBTWlCLE1BQU0sQ0FBQ2EsTUFBTTtvREFBQzs7Ozs7Ozs7Ozs7OztvQ0FHeEI5QixNQUFNK0IsV0FBVyxrQkFDaEIsOERBQUNOO3dDQUFFTixXQUFVO2tEQUFzQm5CLE1BQU0rQixXQUFXOzs7Ozs7Ozs7Ozs7MENBR3hELDhEQUFDdEMsa0RBQUlBO2dDQUNIaUMsTUFBSztnQ0FDTFAsV0FBVTswQ0FDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBTUwsOERBQUNEO29CQUFJQyxXQUFVOztzQ0FDYiw4REFBQzVCLGlFQUFhQTs0QkFDWnlDLGlCQUFpQmxCOzRCQUNqQm1CLFNBQVN0QyxPQUFPVyxFQUFFOzRCQUNsQjRCLFlBQVc7NEJBQ1hDLGlCQUFnQjs7Ozs7O3dCQUdqQm5DLE1BQU1pQixNQUFNLENBQUNhLE1BQU0sR0FBRyxrQkFDckIsOERBQUN4Qyw2REFBU0E7NEJBQ1IyQixRQUFRakIsTUFBTWlCLE1BQU07NEJBQ3BCbUIsY0FBYyxDQUFDQyxRQUFVdEMsT0FBT0ssSUFBSSxDQUFDLFVBQW1CLE9BQVRpQyxNQUFNL0IsRUFBRTs0QkFDdkRnQyxVQUFVOzs7OztpREFHWiw4REFBQ3BCOzRCQUFJQyxXQUFVO3NDQUNiLDRFQUFDTTtnQ0FBRU4sV0FBVTswQ0FBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFPM0M7R0E3SHdCekI7O1FBQ1lSLHVEQUFVQTtRQUM3QkMsc0RBQVNBOzs7S0FGRk8iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2FwcC9hbGJ1bXMvW2lkXS9wYWdlLnRzeD8xYTIyIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcblxuaW1wb3J0IHsgdXNlU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aC9yZWFjdCc7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L25hdmlnYXRpb24nO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBJbWFnZUdyaWQgZnJvbSAnQC9jb21wb25lbnRzL0ltYWdlR3JpZCc7XG5pbXBvcnQgSW1hZ2VVcGxvYWRlciBmcm9tICdAL2NvbXBvbmVudHMvSW1hZ2VVcGxvYWRlcic7XG5pbXBvcnQgdG9hc3QgZnJvbSAncmVhY3QtaG90LXRvYXN0JztcbmltcG9ydCBMaW5rIGZyb20gJ25leHQvbGluayc7XG5cbmludGVyZmFjZSBBbGJ1bSB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIGltYWdlczogSW1hZ2VbXTtcbn1cblxuaW50ZXJmYWNlIEltYWdlIHtcbiAgaWQ6IHN0cmluZztcbiAgdGl0bGU/OiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICB0aHVtYm5haWxVcmw6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQWxidW1QYWdlKHsgcGFyYW1zIH06IHsgcGFyYW1zOiB7IGlkOiBzdHJpbmcgfSB9KSB7XG4gIGNvbnN0IHsgZGF0YTogc2Vzc2lvbiwgc3RhdHVzIH0gPSB1c2VTZXNzaW9uKCk7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuICBjb25zdCBbYWxidW0sIHNldEFsYnVtXSA9IHVzZVN0YXRlPEFsYnVtIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzdGF0dXMgPT09ICd1bmF1dGhlbnRpY2F0ZWQnKSB7XG4gICAgICByb3V0ZXIucHVzaCgnL2xvZ2luJyk7XG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09ICdhdXRoZW50aWNhdGVkJykge1xuICAgICAgZmV0Y2hBbGJ1bUFuZEltYWdlcygpO1xuICAgIH1cbiAgfSwgW3N0YXR1cywgcGFyYW1zLmlkXSk7XG5cbiAgY29uc3QgZmV0Y2hBbGJ1bUFuZEltYWdlcyA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYWxidW1SZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2FsYnVtcy8ke3BhcmFtcy5pZH1gKTtcblxuICAgICAgaWYgKCFhbGJ1bVJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcign6I635Y+W5Zu+5bqT5L+h5oGv5aSx6LSlJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFsYnVtRGF0YSA9IGF3YWl0IGFsYnVtUmVzcG9uc2UuanNvbigpO1xuXG4gICAgICBzZXRBbGJ1bShhbGJ1bURhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0b2FzdC5lcnJvcign6I635Y+W5Zu+5bqT5L+h5oGv5aSx6LSlJyk7XG4gICAgICByb3V0ZXIucHVzaCgnL2FsYnVtcycpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVVcGxvYWRTdWNjZXNzID0gKG5ld0ltYWdlczogSW1hZ2VbXSkgPT4ge1xuICAgIHNldEFsYnVtKChwcmV2QWxidW0pID0+ICh7XG4gICAgICAuLi5wcmV2QWxidW0sXG4gICAgICBpbWFnZXM6IFsuLi5wcmV2QWxidW0uaW1hZ2VzLCAuLi5uZXdJbWFnZXNdLFxuICAgIH0pKTtcbiAgfTtcblxuICBpZiAoaXNMb2FkaW5nKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02IHB0LTI0XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFuaW1hdGUtcHVsc2Ugc3BhY2UteS00XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtOCBiZy1ncmF5LTIwMCByb3VuZGVkIHctMS80XCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtNCBiZy1ncmF5LTIwMCByb3VuZGVkIHctMS8yXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgc206Z3JpZC1jb2xzLTIgbWQ6Z3JpZC1jb2xzLTMgbGc6Z3JpZC1jb2xzLTQgZ2FwLTRcIj5cbiAgICAgICAgICAgICAge1suLi5BcnJheSg4KV0ubWFwKChfLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT1cImFzcGVjdC1zcXVhcmUgYmctZ3JheS0yMDAgcm91bmRlZC1sZ1wiPjwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBpZiAoIWFsYnVtKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02IHB0LTI0XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHB5LTEyXCI+XG4gICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1zZW1pYm9sZCB0ZXh0LWdyYXktOTAwXCI+5Zu+5bqT5LiN5a2Y5ZyoPC9oMj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTIgdGV4dC1ncmF5LTYwMFwiPuivpeWbvuW6k+WPr+iDveW3suiiq+WIoOmZpOaIluaCqOayoeacieiuv+mXruadg+mZkDwvcD5cbiAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgIGhyZWY9XCIvYWxidW1zXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXQtNCBpbmxpbmUtYmxvY2sgdGV4dC1ibHVlLTUwMCBob3Zlcjp0ZXh0LWJsdWUtNjAwXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAg6L+U5Zue5Zu+5bqT5YiX6KGoXG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwLTYgcHQtMjRcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG9cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi04XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC00XCI+XG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LWdyYXktOTAwXCI+e2FsYnVtLm5hbWV9PC9oMT5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgICAgICAgIHthbGJ1bS5pbWFnZXMubGVuZ3RofSDlvKDlm77niYdcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7YWxidW0uZGVzY3JpcHRpb24gJiYgKFxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm10LTEgdGV4dC1ncmF5LTUwMFwiPnthbGJ1bS5kZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgIGhyZWY9XCIvYWxidW1zXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTYwMCBob3Zlcjp0ZXh0LWdyYXktOTAwXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAg6L+U5Zue5Zu+5bqT5YiX6KGoXG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS04XCI+XG4gICAgICAgICAgPEltYWdlVXBsb2FkZXJcbiAgICAgICAgICAgIG9uVXBsb2FkU3VjY2Vzcz17aGFuZGxlVXBsb2FkU3VjY2Vzc31cbiAgICAgICAgICAgIGFsYnVtSWQ9e3BhcmFtcy5pZH1cbiAgICAgICAgICAgIGJ1dHRvblRleHQ9XCLkuIrkvKDlm77niYdcIlxuICAgICAgICAgICAgYnV0dG9uQ2xhc3NOYW1lPVwiYmctYmx1ZS01MDAgdGV4dC13aGl0ZSBweC00IHB5LTIgcm91bmRlZC1sZyBob3ZlcjpiZy1ibHVlLTYwMCB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgLz5cblxuICAgICAgICAgIHthbGJ1bS5pbWFnZXMubGVuZ3RoID4gMCA/IChcbiAgICAgICAgICAgIDxJbWFnZUdyaWRcbiAgICAgICAgICAgICAgaW1hZ2VzPXthbGJ1bS5pbWFnZXN9XG4gICAgICAgICAgICAgIG9uSW1hZ2VDbGljaz17KGltYWdlKSA9PiByb3V0ZXIucHVzaChgL2ltYWdlLyR7aW1hZ2UuaWR9YCl9XG4gICAgICAgICAgICAgIGdyaWRDb2xzPXs2fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBweS0xMiBiZy13aGl0ZSByb3VuZGVkLWxnIHNoYWRvdy1zbVwiPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNTAwXCI+5pqC5peg5Zu+54mH77yM54K55Ye75LiK5pa55oyJ6ZKu5LiK5LygPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLCJuYW1lcyI6WyJ1c2VTZXNzaW9uIiwidXNlUm91dGVyIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJJbWFnZUdyaWQiLCJJbWFnZVVwbG9hZGVyIiwidG9hc3QiLCJMaW5rIiwiQWxidW1QYWdlIiwicGFyYW1zIiwiZGF0YSIsInNlc3Npb24iLCJzdGF0dXMiLCJyb3V0ZXIiLCJhbGJ1bSIsInNldEFsYnVtIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwicHVzaCIsImZldGNoQWxidW1BbmRJbWFnZXMiLCJpZCIsImFsYnVtUmVzcG9uc2UiLCJmZXRjaCIsIm9rIiwiRXJyb3IiLCJhbGJ1bURhdGEiLCJqc29uIiwiZXJyb3IiLCJoYW5kbGVVcGxvYWRTdWNjZXNzIiwibmV3SW1hZ2VzIiwicHJldkFsYnVtIiwiaW1hZ2VzIiwiZGl2IiwiY2xhc3NOYW1lIiwiQXJyYXkiLCJtYXAiLCJfIiwiaSIsImgyIiwicCIsImhyZWYiLCJoMSIsIm5hbWUiLCJzcGFuIiwibGVuZ3RoIiwiZGVzY3JpcHRpb24iLCJvblVwbG9hZFN1Y2Nlc3MiLCJhbGJ1bUlkIiwiYnV0dG9uVGV4dCIsImJ1dHRvbkNsYXNzTmFtZSIsIm9uSW1hZ2VDbGljayIsImltYWdlIiwiZ3JpZENvbHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/albums/[id]/page.tsx\n"));

/***/ })

});