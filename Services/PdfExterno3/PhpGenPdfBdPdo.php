<?php
namespace Design\DesignBundle\Services\PdfExterno3;
class PhpGenPdfBdPdo {
    /** @var PDO  */
    private   $conn           = NULL;
    private   $rowAfect       = 0;
    protected $lastInsertId   = null;
    protected $BdSelec        = "";
    /**
     *
     * @return PDO 
     */
    public function getConection(){
        return $this->conn;
    }
    public function rollback(){
        return $this->conn->rollback();
    }
    public function beginTransaction(){
        return $this->conn->beginTransaction();
    }
    
    public function __construct($cnn) {
        $this->conn = $cnn;
    }
    private function guardoUltimasSql($ssql,$paramSql=null) {
    }
    /**
     * @param string $ssql
     * @param array $paramSql
     * @return PDOStatement
     */
    public function query($ssql, $paramSql=null) {
        $this->guardoUltimasSql($ssql,$paramSql );
        try {
            $aux            = $this->conn->prepare($ssql);
            if ($paramSql != "") {
                $aux->execute($paramSql);
            }else{
                $aux->execute();

            }
            $this->rowAfect = $aux->rowCount();
            $this->lastInsertId = $this->conn->lastInsertId();
        } catch (PDOException $e) {
            //$db = Db::getConexion()->__toString();
            $this->manejadorErrores($e);
            return false;
        }
        return $aux;
    }

    /**
     * Ejecuta una query
     * @param string $ssql Query a ejecutar
     * @param bool  $manejadorDeErrorAutomatico por default toma la conf de la coneccion.
     * @return  string retorna la cantidad de registros afectados
     */
    function ejecute($ssql, $manejadorDeErrorAutomatico=NULL) {
        $this->guardoUltimasSql($ssql);
        try {
            $this->rowAfect = $this->conn->exec($ssql);
            $this->lastInsertId = $this->conn->lastInsertId();
        } catch (Exception $e) {
            $this->manejadorErrores($e);
        }
        return $this->rowAfect;
    }

    /**
     * Selecciona la DB
     * @param string $base Nombre de la base de datos
     * @return retorna Devuelve TRUE si todo se llev� a cabo correctamente,
     * FALSE en caso de fallo, teniendo en cuenta el manejador de errores interno
     */
    function setBD($base) {
        if (is_object($this->conn)) {
            $this->ejecute("use $base");
            $this->BdSelec = $base;
            return true;
        }
        return false;
    }
    function getBd() {return $this->BdSelec;}
    //--------------------------------------------------------------------------
    /**
     * @param PDOStatement $RecordSet
     * @return array
     */
    function next($RecordSet, $type = PDO::FETCH_ASSOC, $className="") {
        if (is_object($RecordSet)) {
            if ($className == "") {
                return $RecordSet->fetch($type);
            } else {
                return $RecordSet->fetchObject($className);
            }
        } else {
            $false = false;
            return $false;
        }
    }
    /**
     * Devuelve la cantidad de registros afectados en la ultima operacion
     * @return integer
     */
    public function getRowAfect() {
        return $this->rowAfect;
    }
}

?>