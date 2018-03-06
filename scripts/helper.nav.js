/**
 * @file 头部导航
 * @description 由 source/_data/menu.yml 配置生成
 * @author xuexb <fe.xiaowu@gmail.com>
 */

/* global hexo */

'use strict';

hexo.extend.helper.register('nav', function (className) {
    const self = this;
    const menu = self.site.data.menu;
    let result = [];

    /**
     * 创建菜单
     *
     * @param  {string} path  链接
     * @param  {string} title 文本
     *
     * @return {string}
     */
    const createItem = (path, title) => {
        // 移动端不输出跳出的链接，因为兼容不好
        if (className === 'mobile' && path.substr(0, 1) !== '/') {
            return '';
        }
        return `<li><a href="${self.url_for(path)}">${title}</a></li>`;
    };

    const searchElement = (() => {
        let prefix = 'https://www.baidu.com/s?';
        if (className === 'mobile') {
            // 移动端使用m.baidu.com 搜索，否则si ct 参数无效
            prefix = 'https://m.baidu.com/s?';
        }
        let elementHtml = `<li>`
            + `<mip-form class="nav-search" method="get" url="${prefix}">`
                + `<input type="text" name="wd" placeholder="搜索关键词" autocomplete="off">`
                + `<input type="hidden" name="si" value="www.mipengine.org">`
                + `<input type="hidden" name="ct" value="2097152">`
                + `<button type="submit" value="" class="fa fa-search"></button>`
            + `</mip-form></li>`;
        return elementHtml;
    })();

    Object.keys(menu).forEach(title => {
        const path = menu[title];

        // 一级菜单
        if ('string' === typeof path) {
            return result.push(createItem(path, title));
        }

        result.push(`<li><span>${title}</span><ul>`);

        Object.keys(path).forEach(subtitle => result.push(createItem(path[subtitle], subtitle)));

        result.push('</ul></li>');
    });

    return `<ul class="${className}-nav-list">${result.join('')}${searchElement}</ul>`;
});
