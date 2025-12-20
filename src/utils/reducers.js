// reducers (LogData - BodyLogData) 175 Line :)

export function AccessLogData(state, action) {
    switch (action.type) {
        
        // 1. افزودن آیتم جدید
        case "Add": {
            return ([
                ...state,
                {
                    id: action.log_id,
                    name: action.log_name,
                    sets: action.log_sets,
                    editing: action.log_editing,
                    date: action.log_date,
                    countsByWeight: action.log_haveWeight,
                    specialRepFlag: action.log_specialRepFlag // پرچم واحد تکرار (m, km, etc)
                }
            ]);
        }
        
        // 2. حذف آیتم (Workout)
        case "Delete": {
            return state.filter(log => log.id !== action.log_id);
        }
        
        // 3. شروع ویرایش (باز کردن فرم Add Set)
        case "Start Edit": {
            // فقط آیتم مورد نظر را editing: true و بقیه را editing: false می‌کند.
            return state.map(log => {
                if (log.id === action.log_id) {
                    return { ...log, editing: true };
                }
                // بستن حالت ویرایش برای بقیه
                return { ...log, editing: false }; 
            });
        }
        
        // 4. تأیید ویرایش (افزودن یک ست جدید)
        case "Confirm Edit": {
            // به‌روزرسانی ست‌ها و خاموش کردن حالت ویرایش بر اساس ID
            return state.map(log => {
                if (log.id === action.log_id) {
                    return { ...log, sets: action.log_sets };
                }
                return log;
            });
        }
        case "End Edit": {
            return state.map(log => {
                if (log.id === action.log_id) {
                    return { ...log, editing: false };
                }
                return log;
            });
        }
        
        // 5. حذف یک ست خاص
        case "Remove Set": {
            return state.map(log => {
                if (log.id === action.log_id) {
                    // فیلتر کردن ست بر اساس ID ست (نه index)
                    const updatedSets = log.sets.filter(set => (set.id !== action.log_target_id))
                    
                    // 💡 سختگیری: اگر لیست ست‌ها خالی شد، ورک‌آوت را هم پاک کن.
                    if (updatedSets.length === 0) {
                        return null; // بعداً فیلتر می‌شود
                    }
                    return {...log, sets: updatedSets}
                }
                return log
            }).filter(Boolean) // حذف آیتم‌های null (ورک‌آوت‌های حذف شده)
        }
        
        // 6. شروع ویرایش تکرار (Rep)
        case "Start Rep Edit": {
            return state.map(log => {
                if (log.id === action.log_id) {
                    const updatedSets = log.sets.map(set => {
                        let newSet = {...set, RepEdit: false, WeightEdit: false} // بستن همه حالت‌های ویرایش
                        if (set.id === action.log_target_id) {
                            newSet = {...newSet, RepEdit: true} // باز کردن حالت ویرایش Rep
                        } 
                        return newSet
                    })
                    return {...log, sets: updatedSets}
                }
                return log
            })
        }
        
        // 7. تأیید ویرایش تکرار (Rep)
        case "Confirm Rep Edit": {
            return state.map(log => {
                if (log.id === action.log_id) {
                    const updatedSets = log.sets.map(set => {
                        let newSet = set
                        if (set.id === action.log_target_id) {
                            newSet = {...set, RepEdit: false, reps : action.log_target_reps}
                        } 
                        return newSet
                    })
                    return {...log, sets: updatedSets}
                }
                return log
            })
        }

        // 8. شروع ویرایش وزن (Weight)
        case "Start Weight Edit": {
            return state.map(log => {
                if (log.id === action.log_id) {
                    const updatedSets = log.sets.map(set => {
                        let newSet = {...set, RepEdit: false, WeightEdit: false} // بستن همه حالت‌های ویرایش
                        if (set.id === action.log_target_id) {
                            newSet = {...newSet, WeightEdit: true} // باز کردن حالت ویرایش Weight
                        } 
                        return newSet
                    })
                    return {...log, sets: updatedSets}
                }
                return log
            })
        }
        
        // 9. تأیید ویرایش وزن (Weight)
        case "Confirm Weight Edit": {
            return state.map(log => {
                if (log.id === action.log_id) {
                    const updatedSets = log.sets.map(set => {
                        let newSet = set
                        if (set.id === action.log_target_id) {
                            newSet = {...set, WeightEdit: false, weight : action.log_target_weight}
                        } 
                        return newSet
                    })
                    return {...log, sets: updatedSets}
                }
                return log
            })
        }

        // 10. علامت‌گذاری ست به عنوان انجام شده
        case "Check Set": {
            return state.map(log => {
                if (log.id === action.log_id) {
                    const updatedSets = log.sets.map(set => {
                        let newSet = set
                        if (set.id === action.log_target_id) {
                            newSet = {...set, done : !set.done} // تغییر وضعیت چک باکس
                        } 
                        return newSet
                    })
                    return {...log, sets: updatedSets}
                }
                return log
            })
        }
        
        default: {
            // سختگیری: اگر یک اکشن ناشناخته رسید، خطا بده
            throw Error("Error Access LogData! action type " + action.type + " is not declared.");
        }
    }
}
export function AccessBodyLogData(state, action) {
    switch (action.type) {
        case "Add": {
            return [...state, {
                id: action.id,
                date: action.date,
                metr: action.metr,
                value: action.value
            }]
        }
        case "Delete": {
            return state.filter( log => log.id !== action.id )
        }
        default: {
            throw Error("Error Access BodyLogData! action type " + action.type + " is not declared.");
        }
    }
}