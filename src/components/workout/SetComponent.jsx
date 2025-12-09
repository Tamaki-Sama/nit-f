import { useState, useEffect } from 'react'
import { Confirm, Delete } from '../common/Icons'
import { Button, Checkbox, Input } from 'antd';
import '../../styles/Log.css'

export default function Set ({setObject, setID, workoutID, setIndex, effectLogData, workoutSpecialRepFlag, countsByWeight, OnSetChecked}) {
    // 💡 Local State برای کنترل Input در حین ویرایش و جلوگیری از re-renderهای اضافی
    const [currentReps, setCurrentReps] = useState(setObject.reps); 
    // استفاده از || 0 برای تضمین مقدار عددی در حالت ویرایش وزن
    const [currentWeight, setCurrentWeight] = useState(setObject.weight || 0);

    // 💡 Sync کردن Local State با props هرگاه setID تغییر کند (برای جلوگیری از باگ‌های UI)
    useEffect(() => {
        setCurrentReps(setObject.reps);
        setCurrentWeight(setObject.weight || 0);
    }, [setObject.reps, setObject.weight, setID]);


    function handleRepInputChange(e) {
        setCurrentReps(Number(e.target.value))
    }
    function handleWeightInputChange (e) {
        setCurrentWeight(Number(e.target.value))
    }
    
    function deletethisSet(e){
        e.preventDefault()
        effectLogData({
            type: "Remove Set",
            log_id: workoutID,
            log_target_id: setID 
        })
    }

    function handleCheck(e) {
        effectLogData({
            type: "Check Set",
            log_id: workoutID,
            log_target_id: setID 
        })
        if (!setObject.done){
            OnSetChecked()
        }
    }

    // 1. منطق ویرایش تکرار (Reps)
    function toggleRepEditing(e) {
        e.preventDefault()
        if (setObject.RepEdit) {
            // Confirm Edit: تغییر را به Reducer ارسال کن
            effectLogData({
                type: "Confirm Rep Edit",
                log_id: workoutID,
                log_target_id: setID,
                log_target_reps: currentReps // استفاده از مقدار ویرایش شده
            })
        } else {
            // Start Edit: حالت ویرایش را فعال کن
            effectLogData({
                type: "Start Rep Edit",
                log_id: workoutID,
                log_target_id: setID
            })
        }
    }


    // 2. منطق ویرایش وزن (Weight)
    function toggleWeightEditing(e) {
        e.preventDefault()
        if (setObject.WeightEdit) {
            // Confirm Edit: تغییر را به Reducer ارسال کن
            effectLogData({
                type: "Confirm Weight Edit",
                log_id: workoutID,
                log_target_id: setID,
                log_target_weight: currentWeight
            })
        } else {
            // Start Edit: حالت ویرایش را فعال کن
            effectLogData({
                type: "Start Weight Edit",
                log_id: workoutID,
                log_target_id: setID
            })
        }
    }

    return (
        <li className={`set-item`}>
            {/* ۱. ستون شماره ست */}
            <span className="set-index">{setIndex}</span>

            <span className={`set-weight-container ${countsByWeight ? 'editable-field' : 'disabled-field'}`}>
                {countsByWeight ? (
                    setObject.WeightEdit ? (
                    <span className='inline-edit-form' style={{width: '60px', minHeight: '48px'}}>
                        <Input 
                            type="number"
                            value={currentWeight} 
                            onChange={handleWeightInputChange} 
                            min="0"
                            size="small" 
                            style={{ width: '60px', textAlign: 'center', height: '32px' }} 
                        />
                        <Button style={{width: '60px', height: '32px'}} size="small" type="primary" onClick={toggleWeightEditing}>{Confirm}</Button>
                    </span>
                    ) : (
                        <span onClick={toggleWeightEditing}> 
                            {setObject.weight}
                            <span className="set-unit">kgs</span>
                        </span>
                    )
                ) : (
                    '—'
                )}
            </span> 
            <span className="set-reps-container">
                {setObject.RepEdit ? (
                    // حالت ویرایش تکرار
                    <span className='inline-edit-form' style={{width: '60px', minHeight: '48px'}}>
                        <Input 
                            type="number" // برای نمایش کیبورد عددی در موبایل
                            value={currentReps} 
                            onChange={handleRepInputChange} 
                            min="0"
                            size="small" 
                            style={{ width: '60px', textAlign: 'center', height: '32px' }} 
                        />
                        <Button style={{width: '60px', height: '32px'}} size="small" type="primary" onClick={toggleRepEditing}>{Confirm}</Button>
                    </span>
                ) : (
                    <span onClick={toggleRepEditing}> 
                        {setObject.reps}
                        <span className="set-unit">{workoutSpecialRepFlag ? workoutSpecialRepFlag : 'reps'}</span>
                    </span>
                )}
            </span>
            <Checkbox 
                checked={setObject.done || false} 
                onChange={handleCheck} 
            />
            <Button type="text" danger icon={Delete} onClick={deletethisSet} size="large" />
        </li>
    )
}