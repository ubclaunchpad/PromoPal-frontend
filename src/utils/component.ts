/**
 * Constructs a string containing a list of classes in the following way:
 * (1) If `classNames` is provided, adds the string(s) to the result
 * (2) Takes the keys and values of `conditionalClassNames` and adds the key to the result if the value is true
 *
 * @param conditionalClassNames - An object where the keys are class names and values are whether to apply the class
 * @param classNames - The class names to apply
 */
export function className(
  conditionalClassNames: { [className: string]: boolean },
  classNames?: string | string[]
): string {
  let initialClasses = '';
  if (classNames) {
    initialClasses += Array.isArray(classNames) ? classNames.join(' ') : classNames;
  }

  return Object.entries(conditionalClassNames).reduce((classes, [className, shouldApply]) => {
    if (shouldApply) {
      return `${classes} ${className}`;
    }
    return classes;
  }, initialClasses);
}
