;
(function (ng) {
  'use strict';
  ng.module('bitToggleSwitch').directive('bitToggleSwitch', [function () {
      var instanceCount = 0;
      return {
        restrict: 'A',
        scope: {
          status: '=hbToggleSwitch',
          beforeCb: '&hbToggleSwitchBefore',
          labels: '=hbToggleSwitchLabels'
        },
        template: function (element, attrs) {
          return '<div class="toggle-switch" data-ng-click="toggle()">' + '<div class="on-state state" data-ng-class="{ \'on-state-visible\': status, \'on-state-hidden\': !status }">' + '<div class="state-label">{{labels.on}}</div>' + '<div class="indicator"></div>' + '</div>' + '<div class="off-state state" data-ng-class="{ \'off-state-visible\': !status, \'off-state-hidden\': status }">' + '<div class="indicator"></div>' + '<div class="state-label">{{labels.off}}</div>' + '</div>' + '</div>';
        },
        transclude: true,
        link: function (scope, element, attrs, ctrl, transcludeFn) {
          var currentInstance = instanceCount++;
          var instanceId = 'toggle-switch-' + currentInstance;
          var parentWidth = 0;
          var elementWidth = 0;
          var offElement = element.find('.off-state');
          var onElement = element.find('.on-state');
          scope.$watch('status', function statusCb(newValue, oldValue) {
          });
          scope.toggle = toggle;
          activate();
          function activate() {
            transcludeFn(scope.$parent, function transcludeFnCb(clone, scope) {
              for (var i = 0, ilen = clone.length; i < ilen; i++) {
                var elem = angular.element(clone[i]);
                var isOff = elem.attr('data-hb-toggle-switch-off');
                var isOn = elem.attr('data-hb-toggle-switch-on');
                if (isOff !== undefined && isOff !== false) {
                  element.find('.off-state').append(elem);
                  element.find('.off-state .state-label').remove();
                }
                if (isOn !== undefined && isOn !== false) {
                  element.find('.on-state').append(elem);
                  element.find('.on-state .state-label').remove();
                }
              }
            });
            if (typeof scope.status !== 'boolean') {
              scope.status = false;
            }
            if (!scope.labels.on)
              scope.labels.on = 'On';
            if (!scope.labels.off)
              scope.labels.off = 'Off';
            var height = onElement.height() + parseFloat(onElement.css('margin-top')) + parseFloat(onElement.css('margin-bottom'));
            element.find('.toggle-switch').css('height', Math.ceil(height) + 'px');
            var width = getMaximumWidth();
            var labelElements = element.find('.state-label');
            for (var i = 0, ilen = labelElements.length; i < ilen; i++) {
              var tmp = angular.element(labelElements[i]);
              tmp.css('width', width + 'px');
              var margins = Math.ceil(parseFloat(tmp.css('margin-left')) + parseFloat(tmp.css('margin-right')));
              elementWidth = Math.max(elementWidth, width + margins);
              var p = tmp.parent();
              margins = Math.ceil(parseFloat(p.css('margin-left')) + parseFloat(p.css('margin-right')));
              parentWidth = Math.max(parentWidth, tmp.parent().width() + margins);
            }
            element.css('width', parentWidth);
            element.addClass(instanceId);
            addStylesToDOM(elementWidth);
          }
          function addStylesToDOM(width) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.' + instanceId + ' .on-state-visible { left: 0; } ' + '.' + instanceId + ' .on-state-hidden { left: -' + width + 'px; } ' + '.' + instanceId + ' .off-state-visible { left: 0; } ' + '.' + instanceId + ' .off-state-hidden { left: ' + width + 'px; }';
            document.getElementsByTagName('head')[0].appendChild(style);
          }
          function getMaximumWidth() {
            var width = 0;
            var testElem = angular.element('<div style="position: absolute; float: left; white-space: nowrap; visibility: hidden;"></div>');
            element.append(testElem);
            width = Math.max(width, getElementWidth(testElem, element.find('[data-hb-toggle-switch-on]'), scope.labels.on));
            width = Math.max(width, getElementWidth(testElem, element.find('[data-hb-toggle-switch-off]'), scope.labels.off));
            testElem.remove();
            return width;
          }
          function getElementWidth(testElem, transcludeElem, textLabel) {
            var width = 0;
            if (transcludeElem.length > 0) {
              width = Math.max(width, Math.ceil(transcludeElem.width()));
            } else {
              testElem.html(textLabel);
              width = Math.ceil(testElem.width());
            }
            return width;
          }
          function toggle() {
            if (scope.beforeCb()) {
              scope.beforeCb()(!scope.status).then(function beforeStatusChangeCb() {
                scope.status = !scope.status;
              }, function beforeStatusChangeCbFail() {
              });
            } else {
              scope.status = !scope.status;
            }
          }
        }
      };
    }]);
}(angular));